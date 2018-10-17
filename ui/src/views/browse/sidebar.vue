<template>
    <v-sidebar :active="sidebar">
        <v-spinner background-color="var(--sidebar-spinner-background-color)" :size="48" v-if="loading"></v-spinner>

        <v-message class="full" type="placeholder" v-else-if="collections.length === 0 &&
            !collection.entries">{{ $t("mesg.collections.none") }}</v-message>

        <template v-else>
            <v-label>{{ (collection.options ? collection.options.title : collection.name) ||
                $t("label.browse") }}</v-label>

            <v-button icon="arrow-left" :exact="true" :to="{name: 'browse-collections',
                params: {id: collection.parent}}" v-if="collection.parent">{{ $t("label.goto.parent") }}</v-button>
            <v-button icon="arrow-left" :exact="true" :to="{name: 'browse-root'}"
                v-else-if="$route.name != 'browse-root'">{{ $t("label.goto.home") }}</v-button>

            <v-button icon="folder" :key="collection.id"
                :to="{name: 'browse-collections', params: {id: collection.alias || collection.id}}"
                v-for="collection in collections">{{ collection.label }}</v-button>

            <v-button :class="{folded: folded[idx]}" :icon="folded[idx] ? 'eye-slash' : null" :key="idx"
                :to="{params: {id: collection.id}, hash: `#graph${idx}`, query: $route.query}"
                @click.native="folded[idx] && emitUnfold(idx); compact && hideSidebar()"
                @mouseenter.native="!compact && emitHighlight(idx)"
                @mouseleave.native="!compact && emitHighlight(null)"
                v-for="(item, idx) in collection.entries">{{ item.options.title }}</v-button>
        </template>
    </v-sidebar>
</template>

<script>
export default {
    data() {
        return {
            folded: {},
            loading: false,
        };
    },
    computed: {
        collection() {
            let collection = this.$store.getters.collection,
                keyBase = `${this.$route.params.type}_${this.$route.params.id}_`;

            if (collection) {
                this.folded = collection.entries.reduce((entries, entry, idx) => {
                    let key = keyBase + idx;
                    entries[idx] = !!(this.$store.getters.state[key] && this.$store.getters.state[key].folded);
                    return entries;
                }, {});
            }

            return collection || {};
        },
        collections() {
            return this.$store.getters.collections || [];
        },
        compact() {
            return this.$mq != "large";
        },
        params() {
            return this.$route.params;
        },
        sidebar() {
            return this.$store.getters.sidebar;
        },
    },
    methods: {
        emitHighlight(idx) {
            this.$events.$emit("highlight-graph", idx);
        },
        fetchCollections() {
            if (this.params.type == "basket") {
                this.$store.commit("collections", []);
                return;
            }

            this.loading = true;

            let params = {};
            if (this.params.id) {
                params.parent = this.params.id;
            }

            this.$http.get("/api/v1/library/collections/tree", {
                params: params,
            }).then(response => response.json()).then((response) => {
                this.$store.commit("collections", response);
                this.loading = false;
            }).catch((response) => {
                this.$notifier.enqueue(this.$t("mesg.fetch_error", [response.statusText]), "error");
                this.loading = false;
            });
        },
        hideSidebar() {
            this.$store.commit("sidebar", false);
        },
        emitUnfold(idx) {
            this.$events.$emit("graph-action", "unfold", idx);
        },
    },
    watch: {
        "params.id": {
            handler() {
                this.fetchCollections();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.v-sidebar {
    .v-button.folded /deep/ {
        > a {
            flex-direction: row-reverse;

            .v-icon,
            .content {
                opacity: 0.35;
            }

            .v-icon {
                margin-left: 0.5rem;
            }

            .content {
                margin-left: 0;
            }
        }
    }

    .v-message.placeholder.full {
        align-items: center;
        background-color: transparent;
        bottom: 0;
        display: flex;
        justify-content: center;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
    }
}
</style>
