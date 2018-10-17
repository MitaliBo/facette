<template>
    <v-content>
        <v-modal-range v-model="modals.range"></v-modal-range>
        <v-modal-refresh v-model="modals.refresh"></v-modal-refresh>

        <v-spinner :size="48" v-if="loading"></v-spinner>

        <v-message class="full" type="placeholder" v-else-if="!loading && errored">{{ $t("mesg.fetch_failed") }}</v-message>

        <v-graph :attributes="graph.attributes" :graph="graph.id" :options.sync="graph.options" v-else></v-graph>
    </v-content>
</template>

<script>
export default {
    data() {
        return {
            errored: false,
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
                    interval: 0,
                },
            },
            options: {
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
        graph() {
            return this.$store.getters.graph || {};
        },
        params() {
            return this.$route.params;
        },
    },
    methods: {
        fetchGraph() {
            if (this.$route.params.type == "collections") {
                this.errored = false;
                this.loading = true;

                this.$http.get(`/api/v1/library/collections/${this.params.id}`, {
                    params: {
                        expand: 1,
                        fields: "entries.graph,entries.options,entries.attributes,attributes",
                    },
                }).then(response => response.json()).then((response) => {
                    let entry = response.entries[this.params.index];

                    this.$store.commit("graph", {
                        id: entry.graph,
                        options: Object.assign(entry.options || {}, this.options.range),
                        attributes: Object.assign({}, response.attributes, entry.attributes),
                    });

                    this.loading = false;
                }).catch((response) => {
                    this.$notifier.enqueue(this.$t("mesg.fetch_error", [response.statusText]), "error");

                    this.errored = true;
                    this.loading = false;
                });
            } else {
                this.$store.commit("graph", {
                    id: this.params.id,
                    options: Object.assign({}, this.options.range),
                    attributes: null,
                });
            }
        },
        refresh() {
            this.$events.$emit("graph-action", "update");
        },
    },
    mounted() {
        this.$title.set(null);
    },
    watch: {
        "params.id": {
            handler() {
                Object.assign(this.options, {
                    range: {
                        time: this.$params.get("time", null),
                        range: this.$params.get("range", null),
                        start_time: this.$params.get("start_time", null),
                        end_time: this.$params.get("end_time", null),
                    },
                    refresh: parseInt(this.$params.get("refresh", 0), 10),
                });

                this.fetchGraph();
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
    padding: 0 !important;

    /deep/ .v-graph {
        &,
        .container > .canvas {
            min-height: 100vh;
        }

        &:hover .v-graph-slides {
            outline: none;
        }
    }
}
</style>
