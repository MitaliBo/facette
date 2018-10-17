<template>
    <div class="v-graph-tooltip">
        <table>
            <thead>
                <tr>
                    <th class="label" colspan="2">{{ tooltip.title }}</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th class="label">{{ $t("label.total") }}</th>
                    <td>{{ tooltip.total }}</td>
                </tr>
            </tfoot>
            <tbody>
                <tr :key="idx" v-for="(entry, idx) in tooltip.entries">
                    <th>
                        <span class="color" :style="{backgroundColor: entry.color}"></span>
                        {{ entry.name }}
                    </th>
                    <td :class="{null: entry.value === null}">{{ entry.value !== null ? entry.value : "null" }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import * as d3 from "d3";
import moment from "moment";

export default {
    name: "v-graph-tooltip",
    data() {
        return {
            tooltip: {},
        };
    },
    computed: {
        chart() {
            return this.$parent.chart;
        },
    },
    methods: {
        update(e) {
            if (e === null) {
                // Reset tooltip state
                Object.assign(this.$el.style, {
                    bottom: null,
                    display: "none",
                    left: null,
                    right: null,
                    top: this.chart.config.margin,
                });

                return;
            }

            let date = this.chart.xScale.invert(e.layerX - this.chart.area.left),
                bisector = d3.bisector(a => a[0] * 1000).left,
                total = 0;

            let tooltip = {
                title: moment(date).format(this.$t("date.long")),
                entries: this.chart.config.series.reduce((entries, series) => {
                    if (series.disabled) {
                        return entries;
                    }

                    let idx = series.points ? bisector(series.points, date, 1) : -1,
                        value = idx != -1 && series.points[idx] ? series.points[idx][1] : null;

                    if (value) {
                        total += value;
                    }

                    entries.push({
                        color: series.color,
                        name: series.name,
                        value: value !== null ? this.chart.config.axes.y.ticks.format(value) : null,
                    });

                    return entries;
                }, []),
            };

            this.tooltip = Object.assign(tooltip, {total: this.chart.config.axes.y.ticks.format(total)});

            // Check client height before update to prevent flicking
            if (this.$el.clientHeight > 0) {
                let style = {
                    visibility: null,
                };

                if (e.layerX + this.$el.clientWidth >= this.chart.width - this.chart.config.margin * 2) {
                    style.left = `${e.layerX - this.$el.clientWidth - this.chart.config.margin}px`;
                } else {
                    style.left = `${e.layerX + this.chart.config.margin}px`;
                }

                if (e.clientY - this.$el.clientHeight >= this.chart.config.margin) {
                    style.top = `${e.layerY - this.$el.clientHeight}px`;
                } else {
                    style.top = `${this.chart.config.margin}px`;
                }

                Object.assign(this.$el.style, style);
            } else {
                Object.assign(this.$el.style, {
                    display: "block",
                    visibility: "hidden",
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.v-graph-tooltip {
    background-color: var(--graph-tooltip-background-color);
    border-radius: 0.15rem;
    color: var(--graph-tooltip-color);
    display: none;
    font-size: 0.75rem;
    padding: 0.5rem;
    pointer-events: none;
    position: absolute;
    white-space: nowrap;
    will-change: bottom, left, right, top;
    z-index: 250;

    table {
        border-spacing: 0.5rem 0;
        width: 1px;
    }

    th {
        font-weight: normal;
        width: 100%;
    }

    tfoot th,
    tfoot td,
    tbody td {
        text-align: right;
    }

    tbody th {
        text-align: left;
    }

    tfoot th,
    tbody th {
        padding-right: 0.5rem;
    }

    .color {
        border-radius: 0.15rem;
        display: inline-block;
        height: 0.6rem;
        margin-right: 0.25rem;
        vertical-align: middle;
        width: 0.8rem;
    }

    .label,
    .null {
        color: var(--graph-tooltip-label-color);
    }
}
</style>
