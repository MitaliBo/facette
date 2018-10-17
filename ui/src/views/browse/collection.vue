<template>
    <v-content :class="{compact: compact, [`columns${options.columns}`]: !compact, [params.type]: true}">
        <v-modal-range v-model="modals.range"></v-modal-range>
        <v-modal-refresh v-model="modals.refresh"></v-modal-refresh>

        <v-toolbar :direction="compact ? 'row' : 'column'">
            <v-button icon="sync" :badge="options.refresh" :disabled="empty" :dropdown-placement="dropdownPlacement">
                <template slot="dropdown">
                    <v-button @click="refresh(true)">{{ $t(`label.${params.type}.refresh`) }}</v-button>
                    <v-separator></v-separator>
                    <v-button :shortkey="['r']" @click="setRefresh(null)">{{ $t("label.set_interval") }}</v-button>
                </template>
            </v-button>
            <v-button icon="clock" :badge="rangeBadge" :disabled="empty" :dropdown-placement="dropdownPlacement">
                <template slot="dropdown">
                    <v-button icon="history" :disabled="!options.range" @click="setRange(null)">
                        {{ $t("label.timerange.reset") }}</v-button>
                    <v-separator></v-separator>
                    <v-button :icon="`-${range}` == options.range ? 'check' : ''" :key="idx"
                        @click="setRange(`-${range}`)" v-for="(range, idx) in ranges">{{ range }}</v-button>
                    <v-separator></v-separator>
                    <v-button icon="calendar-alt" :shortkey="['shift', 'r']" @click="setRange('custom')">
                        {{ $t("label.timerange.custom") }}</v-button>
                </template>
            </v-button>
            <v-button icon="columns" :disabled="empty" :dropdown-placement="dropdownPlacement"
                    v-if="params.type == 'collections' && !compact">
                <template slot="dropdown">
                    <v-button :icon="options.columns == 1 ? 'check' : ''" @click="setColumns(1)">
                        {{ $tc('label.columns_count', 1, {count: 1}) }}</v-button>
                    <v-button :icon="options.columns == 2 ? 'check' : ''" @click="setColumns(2)">
                        {{ $tc('label.columns_count', 2, {count: 2}) }}</v-button>
                    <v-button :icon="options.columns == 3 ? 'check' : ''" @click="setColumns(3)">
                        {{ $tc('label.columns_count', 3, {count: 3}) }}</v-button>
                </template>
            </v-button>
            <v-separator></v-separator>
            <v-button :disabled="empty" :dropdown-placement="dropdownPlacement"
                    :icon="`ellipsis-${compact ? 'v' : 'h'}`">
                <template slot="dropdown">
                    <template v-if="!readOnly">
                        <v-button icon="save" v-if="params.type == 'basket'">{{ $t(`label.basket.save`) }}</v-button>
                        <v-button icon="pencil-alt" v-else>{{ $t(`label.${params.type}.edit`) }}</v-button>
                        <v-separator></v-separator>
                    </template>
                    <v-button :icon="readOnly ? null : ''" @click="resetState">{{ $t(`label.reset.state`) }}</v-button>
                </template>
            </v-button>
            <template v-if="basketCount > 0 && params.type != 'basket'">
                <v-spacer></v-spacer>
                <v-button icon="shopping-basket" :badge="basketCount" :to="{name: 'browse-basket'}"></v-button>
            </template>
        </v-toolbar>

        <v-spinner :size="48" v-if="loading"></v-spinner>

        <v-message class="full" type="placeholder" v-else-if="errored">{{ $t("mesg.fetch_failed") }}</v-message>

        <v-message class="full" type="placeholder" v-else-if="collection && collection.entries.length === 0">
            {{ $t("mesg.graphs.none") }}</v-message>

        <template v-else>
            <template v-for="(graph, idx) in collection.entries">
                <v-graph :attributes="Object.assign({}, collection.attributes, graph.attributes)"
                    :class="{highlight: highlightIndex === idx}" :graph="graph.graph" :index="idx" :key="idx"
                    :options.sync="graph.options" :persist="true"></v-graph>
            </template>

            <v-spacer></v-spacer>
        </template>
    </v-content>
</template>

<script>
import {ranges} from "../components/graph";

export default {
    data() {
        return {
            errored: false,
            highlightIndex: null,
            loading: false,
            modals: {
                range: {
                    end_time: null,
                    range: null,
                    start_time: null,
                    time: null,
                    type: "relative",
                },
                refresh: {
                    interval: null,
                },
            },
            options: {
                columns: 1,
                range: {
                    end_time: null,
                    range: null,
                    start_time: null,
                    time: null,
                },
                refresh: 0,
            },
            refreshInterval: null,
        };
    },
    computed: {
        basketCount() {
            return this.$store.getters.basket ? this.$store.getters.basket.length : 0;
        },
        collection() {
            return this.$store.getters.collection;
        },
        compact() {
            return this.$mq != "large";
        },
        dropdownPlacement() {
            return this.compact ? "bottom" : "right";
        },
        empty() {
            return !this.collection || this.collection.entries.length === 0;
        },
        params() {
            return this.$route.params;
        },
        rangeBadge() {
            if (!this.options.range.time && !this.options.range.range &&
                    !this.options.range.start_time && !this.options.range.end_time) {
                return null;
            } else if (this.options.range.range && !this.options.range.time) {
                return this.options.range.range;
            }

            return "⋯";
        },
        ranges() {
            return ranges;
        },
        readOnly() {
            return this.$store.getters.readOnly;
        },
        sidebar() {
            return this.$store.getters.sidebar;
        },
    },
    methods: {
        fetchCollection() {
            if (this.params.type == "basket") {
                let basketT = this.$t("label.basket._");

                this.$store.commit("collection", {
                    id: null,
                    name: basketT.toLowerCase(),
                    entries: this.$store.getters.basket || [],
                    options: {
                        title: basketT,
                    },
                });

                return;
            }

            this.errored = false;
            this.loading = true;

            this.$http.get(`/api/v1/library/${this.params.type}/${this.params.id}`, {
                params: {
                    expand: 1,
                    fields: "id,name,entries.graph,entries.options,entries.attributes,options,attributes,parent",
                },
            }).then(response => response.json()).then((response) => {
                this.$title.set(response.options && response.options.title ? response.options.title : response.name);

                if (this.params.type == "graphs") {
                    this.$store.commit("collection", {
                        id: this.params.id,
                        name: response.name,
                        entries: [{
                            graph: response.id,
                            options: Object.assign({title: response.name}, response.options, this.options.range),
                        }],
                        options: {
                            title: this.$t("label.graph"),
                        },
                    });
                } else {
                    response.entries.map((entry) => {
                        entry.options = Object.assign(entry.options || {}, this.options.range);
                    });

                    this.$store.commit("collection", response);
                }

                this.loading = false;
            }).catch((response) => {
                this.$title.set(null);
                this.$notifier.enqueue(this.$t("mesg.fetch_error", [response.statusText]), "error");

                this.errored = true;
                this.loading = false;
            });
        },
        refresh(rearm = false) {
            // Rearm current refresh interval if user requested a manual refresh
            if (rearm && this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = setInterval(this.refresh, this.options.refresh * 1000);
            }

            this.$events.$emit("graph-action", "update");
        },
        resetState() {
            let state = this.$store.getters.state;
            this.$store.commit("state", Object.keys(state).reduce((filtered, key) => {
                if (!key.startsWith(`${this.params.type}_${this.params.id}_`)) {
                    filtered[key] = state[key];
                }
                return filtered;
            }, {}));
            window.dispatchEvent(new Event("resize"));
        },
        setColumns(count) {
            this.options.columns = count;
            window.dispatchEvent(new Event("resize"));
            this.$params.set("columns", count, count > 1);
        },
        setHighlight(idx) {
            this.highlightIndex = idx;
        },
        setRange(range) {
            if (range == "custom") {
                this.$modal.show("range", this.setRange);
                return;
            } else if (typeof range == "string") {
                range = {range: range};
            } else if (range === null) {
                range = {
                    end_time: null,
                    range: null,
                    start_time: null,
                    time: null,
                };
            }

            this.options.range = range;
            this.$modal.hide("range");
            this.$events.$emit("graph-action", "applyRange", range);
            this.$params.set("time", range.time, !!range.time);
            this.$params.set("range", range.range, !!range.range);
            this.$params.set("start_time", range.start_time, !!range.start_time);
            this.$params.set("end_time", range.end_time, !!range.end_time);
        },
        setRefresh(interval = null) {
            if (interval === null) {
                this.modals.refresh.interval = this.options.refresh;
                this.$modal.show("refresh", this.setRefresh);
                return;
            }

            this.options.refresh = parseInt(interval, 10);
            this.$modal.hide("refresh");
            this.$params.set("refresh", interval, interval > 0);
        },
    },
    beforeDestroy() {
        this.$events.$off("highlight-graph", this.setHighlight);

        this.$store.commit("collection", null);
        this.$store.commit("collections", null);
    },
    mounted() {
        this.$events.$on("highlight-graph", this.setHighlight);
    },
    watch: {
        "params.id": {
            handler() {
                // Retrieve parameters from query
                Object.assign(this.options, {
                    columns: parseInt(this.$params.get("columns", 1), 10),
                    range: {
                        time: this.$params.get("time", null),
                        range: this.$params.get("range", null),
                        start_time: this.$params.get("start_time", null),
                        end_time: this.$params.get("end_time", null),
                    },
                    refresh: parseInt(this.$params.get("refresh", 0), 10),
                });

                this.$store.commit("collection", null);
                this.$store.commit("collections", null);
                this.fetchCollection();
            },
            immediate: true,
        },
        "options.refresh": {
            handler(to) {
                if (this.refreshInterval) {
                    clearInterval(this.refreshInterval);
                    this.refreshInterval = null;
                }

                if (to === 0 || isNaN(to)) {
                    return;
                }

                this.refreshInterval = setInterval(this.refresh, to * 1000);
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.v-content {
    &.collections {
        overflow: auto;

        .v-graph {
            float: left;
        }
    }

    &.columns2 .v-graph + .v-graph,
    &.columns3 .v-graph + .v-graph {
        margin-left: 1.5rem;
    }

    &.columns2 .v-graph {
        width: calc((100% - 1.5rem) / 2);

        &:nth-child(-n+3) {
            margin-top: 0;
        }

        &:nth-of-type(2n) {
            margin-left: 0;
        }
    }

    &.columns3 .v-graph {
        width: calc((100% - 3rem) / 3);

        &:nth-child(-n+4) {
            margin-top: 0;
        }

        &:nth-of-type(3n+5) {
            margin-left: 0;
        }
    }

    &.compact .v-graph /deep/ {
        > .anchor {
            top: -7.75rem;
        }
    }

    .v-graph {
        width: 100%;

        /deep/ {
            > .anchor {
                top: -4.75rem;
            }
        }

        & + .v-graph {
            margin-top: 1.5rem;
        }
    }

    .v-spacer {
        clear: both;
        height: 1px;
        margin-top: 2rem;
        width: 100%;
    }
}
</style>
