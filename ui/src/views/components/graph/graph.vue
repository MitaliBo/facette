<template>
    <div class="v-graph" :class="{compact: compact}" v-if="!state.folded">
        <a class="anchor" :id="`graph${index}`"></a>

        <v-spinner :size="48" v-if="loading && !data"></v-spinner>

        <template v-else>
            <v-message icon="clock" type="placeholder" v-if="loading">
                {{ $t("label.points.loading") }}</v-message>

            <v-message type="warning" v-else-if="partial">{{ $t("label.points.partial") }}</v-message>

            <v-graph-toolbar :direction="compact ? 'column' : 'row'"></v-graph-toolbar>

            <v-graph-slides ref="slides" v-if="!touchSupport"></v-graph-slides>

            <div class="container" tabindex="-1" @keypress.esc="cancelZoom" @mousemove="handleMouse">
                <v-graph-cursor ref="cursor"></v-graph-cursor>
                <v-graph-tooltip ref="tooltip"></v-graph-tooltip>
                <v-graph-zoom ref="zoom"></v-graph-zoom>

                <div class="canvas">
                    <canvas></canvas>
                </div>

                <v-graph-legend ref="legend"></v-graph-legend>
            </div>
        </template>
    </div>
</template>

<script>
import boula from "boula";
import * as d3 from "d3";
import debounce from "lodash/debounce";
import pickBy from "lodash/pickBy";
import moment from "moment";

import actions from "./actions";
import {dateFormatRFC3339} from ".";
import {formatSize} from "./helpers";

export default {
    name: "v-graph",
    props: {
        attributes: {
            type: Object,
        },
        graph: {
            required: true,
            type: String,
        },
        index: {
            type: Number,
        },
        options: {
            type: Object,
        },
        persist: {
            type: Boolean,
        },
    },
    data() {
        return {
            chart: null,
            data: null,
            dateFormat: null,
            errored: false,
            loading: true,
            observer: null,
            originalOptions: {},
            partial: false,
            timeDefer: null,
            zoomOrigin: null,
        };
    },
    computed: {
        compact() {
            return this.$mq != "large";
        },
        state: {
            get() {
                return this.$store.getters.state[this.stateKey] || {
                    folded: false,
                    legend: false,
                    lines: {},
                    series: {},
                };
            },
            set(value) {
                if (this.persist) {
                    value.persist = true;
                }
                this.$store.commit("state", Object.assign({}, this.$store.getters.state, {[this.stateKey]: value}));
            },
        },
        stateKey() {
            return `${this.$route.params.type}_${this.$route.params.id}_${this.index || 0}`;
        },
        touchSupport() {
            return "ontouchstart" in document.documentElement;
        },
    },
    methods: {
        afterDraw() {
            // Set cursor/zoom position based on chart area
            let style = {top: `${this.chart.area.top}px`, height: `${this.chart.area.height}px`};

            if (this.$refs.cursor) {
                this.$refs.cursor.update(style);
            }

            if (this.$refs.zoom) {
                this.$refs.zoom.update(style);
            }

            // Trigger initial legend display if enabled
            if (this.state.legend) {
                this.$refs.legend.update();
            }
        },
        applyRange(options) {
            let newOptions = Object.assign({}, this.options, options);

            if (options.start_time || options.end_time) {
                delete newOptions.time;
                delete newOptions.range;
            } else if (options.time || options.range) {
                delete newOptions.start_time;
                delete newOptions.end_time;
            } else {
                delete newOptions.time;
                delete newOptions.range;
                delete newOptions.start_time;
                delete newOptions.end_time;
            }

            this.$emit("update:options", newOptions);
        },
        cancelZoom() {
            if (this.zoomOrigin !== null) {
                this.updateZoom(null, null);
            }
        },
        customRange(range) {
            if (range === null) {
                this.$modal.show("range", this.customRange);
                return;
            }

            this.applyRange(range);
        },
        draw() {
            let canvas = this.$el.querySelector("canvas"),
                parentWidth = parseInt(getComputedStyle(canvas.parentNode).width.replace(/px$/, ""), 10) /
                    devicePixelRatio,
                start = moment(this.data.start),
                end = moment(this.data.end);

            let config = {
                axes: {
                    x: {
                        max: end.toDate(),
                        min: start.toDate(),
                        ticks: {
                            count: parentWidth < 800 ? Math.ceil(parentWidth / 60, 10) : 10,
                        },
                    },
                    y: {
                        center: this.data.options.yaxis_center || false,
                        label: {
                            text: this.data.options.yaxis_label || null,
                        },
                        lines: [],
                        max: this.data.options.yaxis_max || null,
                        min: this.data.options.yaxis_min || null,
                        stack: this.data.options.stack_mode || null,
                        ticks: {
                            format: this.formatValue,
                        },
                    },
                },
                background: {
                    color: document.body.style.getPropertyValue("--app-background-color"),
                },
                bindTo: canvas,
                events: {
                    afterDraw: this.afterDraw,
                    handleEvent: this.handleEvent,
                },
                font: {
                    color: document.body.style.getPropertyValue("--app-color"),
                },
                series: this.data.series.map((series, idx) => ({
                    name: series.name,
                    points: series.points,
                    color: series.options && series.options.color ? series.options.color : null,
                    disabled: this.state.series && typeof this.state.series[idx] == "boolean" ?
                        !this.state.series[idx] : false,
                })),
                titles: {
                    main: {
                        text: this.data.options.title || null,
                    },
                    subtitle: {
                        text: `${start.format(this.dateFormat)} — ${end.format(this.dateFormat)}`,
                    },
                },
                type: this.data.options.type,
            };

            if (this.data.options.constants) {
                config.axes.y.lines = this.data.options.constants.map(constant => ({
                    color: document.body.style.getPropertyValue("--graph-constant-fill-color"),
                    label: true,
                    y: constant,
                }));
            }

            if (
                this.data.options.yaxis_max !== null &&
                Math.max(...this.data.series.map(a => a.summary.max)) > this.data.options.yaxis_max
            ) {
                config.axes.y.lines.push({
                    color: document.body.style.getPropertyValue("--graph-clipping-fill-color"),
                    dashed: true,
                    y: this.data.options.yaxis_max,
                });
            }

            if (
                this.data.options.yaxis_min !== null &&
                Math.min(...this.data.series.map(a => a.summary.min)) < this.data.options.yaxis_min
            ) {
                config.axes.y.lines.push({
                    color: document.body.style.getPropertyValue("--graph-clipping-fill-color"),
                    dashed: true,
                    y: this.data.options.yaxis_min,
                });
            }

            // Keep lines if any defined in state
            Object.keys(this.state.lines).forEach((key) => {
                let idx = key.indexOf("-");
                if (idx == -1) {
                    return;
                }

                let seriesIdx = parseInt(key.substr(0, idx)),
                    summaryKey = key.substr(idx + 1);

                config.axes.y.lines.push({
                    id: key,
                    label: `${this.data.series[seriesIdx].name}/${summaryKey}`,
                    y: this.data.series[seriesIdx].summary[summaryKey],
                    color: document.body.style.getPropertyValue("--graph-line-fill-color"),
                });
            });

            if (!this.chart) {
                this.chart = new boula(config);
            } else {
                this.chart.update(config);
            }

            this.chart.draw();
        },
        exec(name, ...args) {
            if (actions[name]) {
                actions[name].bind(this)(...args);
            }
        },
        formatValue(value) {
            switch (this.data.options.yaxis_unit) {
            case "metric":
                return d3.format(".2s")(value);

            case "binary":
                return formatSize(value);

            default:
                return d3.format(".2r")(value);
            }
        },
        handleEvent(e) {
            switch (e.type) {
            case "mousedown":
                this.updateZoom(e.layerX, null);
                break;

            case "mouseup": {
                if (this.zoomOrigin === null || this.zoomOrigin === e.layerX) {
                    this.updateZoom(null, null);
                    return;
                }

                let [start, end] = [
                    this.chart.xScale.invert(this.zoomOrigin - this.chart.area.left),
                    this.chart.xScale.invert(e.layerX - this.chart.area.left),
                ].sort((a, b) => a > b ? 1 : a < b ? -1 : 0);

                this.applyRange({
                    start_time: start,
                    end_time: end,
                });

                this.updateZoom(null, null);

                // Trigger move event to restore cursor display
                let evt = new Event("mousemove");
                Object.assign(evt, {layerX: e.layerX, layerY: e.layerY});
                this.handleEvent(evt);

                break;
            }

            case "mouseleave":
                this.updateCursor(null);
                this.$refs.tooltip.update(null);
                break;

            case "mousemove":
                if (this.zoomOrigin !== null) {
                    this.updateZoom(null, e.layerX);
                }

                if (
                    e.layerX >= this.chart.area.left && e.layerX <= this.chart.area.left + this.chart.area.width &&
                    e.layerY >= this.chart.area.top && e.layerY <= this.chart.area.top + this.chart.area.height
                ) {
                    this.chart.canvas.style.cursor = "crosshair";
                    this.$refs.tooltip.update(e);

                    this.$events.$emit("graph-cursor", this.chart.xScale.invert(e.layerX - this.chart.area.left));
                } else {
                    this.updateCursor(null);
                    this.chart.canvas.style.cursor = null;
                    this.$refs.tooltip.update(null);

                    this.$events.$emit("graph-cursor", null);
                }
            }
        },
        handleMouse(e) {
            if (this.$refs.slides) {
                this.$refs.slides.handleMouse(e);
            }
        },
        handleResize() {
            if (!this.data || this.observer !== null) {
                return;
            }

            // Reset canvas
            this.chart.clear();

            let canvas = this.$el.querySelector("canvas");
            if (canvas) {
                delete canvas.height;
                delete canvas.style;
                delete canvas.width;
            }

            this.data = null;
            this.update();
        },
        observe() {
            this.observer = new IntersectionObserver((entries) => {
                if (entries[0].intersectionRatio > 0) {
                    this.unobserve();
                    this.update();

                    window.addEventListener("resize", debounce(this.handleResize.bind(this), 200));
                }
            });

            this.observer.observe(this.$el, {threshold: 0});
        },
        setRefresh(interval = null) {
            if (interval === null) {
                this.$parent.$parent.modals.refresh.interval = this.$parent.$parent.options.refresh || 0;
                this.$modal.show("refresh", this.setRefresh);
                return;
            }

            this.$parent.$parent.options.refresh = parseInt(interval, 10);
            this.$modal.hide("refresh");
            this.$params.set("refresh", interval, interval > 0);
        },
        unobserve() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        },
        update() {
            // Set defer time to prevent range delta due to ongoing observe
            if (this.observer) {
                if (!this.options.time && !this.options.start_time && !this.options.end_time) {
                    this.timeDefer = moment().format(dateFormatRFC3339);
                }
                return;
            }

            let query = {
                id: this.graph,
                normalize: true,

                // Set requested sample to half of the element width
                sample: Math.ceil(parseInt(getComputedStyle(this.$el).width.replace(/px$/, ""), 10) / 2),
            };

            Object.assign(query, pickBy(this.options, (value, key) =>
                ["time", "range", "start_time", "end_time"].indexOf(key) != -1));

            // Restore defered time
            if (this.timeDefer) {
                query.time = this.timeDefer;
                this.timeDefer = null;
            }

            if (this.attributes && Object.keys(this.attributes).length > 0) {
                query.attributes = this.attributes;
            }

            this.errored = false;
            this.loading = true;
            this.partial = false;

            this.$http({
                method: "POST",
                url: "/api/v1/series/points",
                body: query,
            }).then(response => response.json()).then((response) => {
                this.data = response;

                this.loading = false;
                this.partial = response.series.filter(series => series.points === null).length > 0;

                this.$nextTick(() => this.draw());
            }).catch((response) => {
                this.$notifier.enqueue(this.$t("mesg.fetch_error", [response.statusText]), "error");

                this.errored = true;
                this.loading = false;
            });
        },
        updateCursor(date = null) {
            if (!this.$refs.cursor) {
                return;
            } else if (this.zoomOrigin === null && this.chart.config && date >= this.chart.config.axes.x.min &&
                    date <= this.chart.config.axes.x.max) {
                this.$refs.cursor.update({
                    display: "block",
                    top: `${this.chart.area.top}px`,
                    left: `${this.chart.area.left + this.chart.xScale(date)}px`,
                });
            } else {
                this.$refs.cursor.update({display: "none"});
            }
        },
        updateZoom(start = null, end = null) {
            let style;

            if (!this.$refs.zoom) {
                return;
            }

            if (start === null && end === null) {
                style = {
                    display: "none",
                    width: 0,
                };

                this.zoomOrigin = null;
            } else if (start !== null && end === null) {
                style = {
                    display: "block",
                    left: `${start}px`,
                };

                this.zoomOrigin = start;
            } else if (start === null && end !== null) {
                style = {
                    left: `${Math.min(end, this.zoomOrigin)}px`,
                    width: `${Math.abs(end - this.zoomOrigin)}px`,
                };
            }

            if (style) {
                this.$refs.zoom.update(style);
            }
        },
    },
    created() {
        this.$events.$on("graph-action", this.exec);
        this.$events.$on("graph-cursor", this.updateCursor);

        // Save original options
        this.originalOptions = Object.assign({}, this.options);
    },
    mounted() {
        if (!this.state.folded) {
            this.observe();
        }
    },
    beforeDestroy() {
        this.$events.$off("graph-action", this.exec);
        this.$events.$off("graph-cursor", this.updateCursor);

        this.unobserve();
        window.removeEventListener("resize", this.handleResize);

        if (this.chart) {
            this.chart.destroy();
        }
    },
    watch: {
        "$store.getters.locale": {
            handler() {
                this.dateFormat = this.$t("date.long");
            },
            immediate: true,
        },
        options: {
            handler() {
                // Execute update at next tick to wait for observers
                if (!this.state.folded) {
                    this.$nextTick(() => { this.update(); });
                }
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.v-graph {
    display: flex;
    position: relative;

    &,
    .container > .canvas {
        min-height: 16rem;
    }

    &:hover,
    &.highlight {
        .v-graph-slides {
            display: flex;
            outline: 0.75rem solid var(--graph-outline-color);
        }
    }

    &:hover {
        .v-message,
        .v-toolbar {
            display: flex;
        }
    }

    &.compact:hover {
        outline: 0.5rem solid var(--graph-outline-color);
    }

    > .anchor {
        left: 0;
        position: absolute;
        top: 0;
    }

    .container {
        flex-grow: 1;
        max-width: 100%;
        overflow: hidden;

        &:focus {
            outline: none;
        }

        canvas {
            display: block;
        }
    }

    .v-graph-slides,
    .v-message,
    .v-toolbar {
        display: none;
    }

    .v-message {
        font-size: 0.8rem;
        left: 1rem;
        line-height: 1.75rem;
        padding: 0 0.5rem;
        position: absolute;
        top: 1rem;
    }

    .v-spinner {
        align-self: center;
        flex-grow: 1;
    }
}
</style>
