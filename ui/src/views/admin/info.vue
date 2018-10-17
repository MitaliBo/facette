<template>
    <v-content>
        <v-toolbar>
            <v-spacer></v-spacer>
            <v-button href="https://facette.io" icon="globe" target="_blank">{{ $t("label.visit.website") }}</v-button>
        </v-toolbar>

        <v-spinner :size="48" v-if="loading"></v-spinner>

        <template v-else>
            <h1>{{ $t("label.info._") }}</h1>

            <dl>
                <template v-if="version">
                    <dt>{{ $t("label.info.version") }}</dt>
                    <dd>{{ version.version }}</dd>
                    <dt>{{ $t("label.info.branch") }}</dt>
                    <dd>{{ version.branch }}</dd>
                    <dt>{{ $t("label.info.revision") }}</dt>
                    <dd>{{ version.revision }}</dd>
                    <dt>{{ $t("label.info.compiler") }}</dt>
                    <dd>{{ version.compiler }}</dd>
                    <dt>{{ $t("label.info.build_date") }}</dt>
                    <dd>{{ version.build_date }}</dd>
                </template>
                <dt>{{ $t("label.info.connectors") }}</dt>
                <dd :key="name" v-for="name in connectors">{{ name }}</dd>
            </dl>
        </template>
    </v-content>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            version: null,
        };
    },
    computed: {
        connectors() {
            return this.$store.getters.connectors;
        },
    },
    methods: {
        fetchVersion() {
            this.loading = true;

            this.$http.get("/api/v1/version").then(response => response.json()).then((response) => {
                this.version = response;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
    },
    mounted() {
        this.$title.set(`${this.$t("label.info._")} – ${this.$t("label.admin_panel._")}`);
        this.fetchVersion();
    },
};
</script>

<style lang="scss" scoped>
.v-content {
    dl {
        margin-top: 0;

        dt {
            color: var(--content-placeholder-color);
            margin-bottom: 0.75rem;
        }

        dd {
            margin: 0 0 0 1.5rem;

            & + dt {
                margin-top: 0.75rem;
            }
        }
    }
}
</style>
