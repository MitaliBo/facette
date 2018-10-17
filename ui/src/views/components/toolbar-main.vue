<template>
    <v-toolbar class="main">
        <template v-if="!search.float">
            <v-button icon="bars" :shortkey="['s']" @click="toggleSidebar"></v-button>

            <router-link class="logo" :to="{name: 'root'}">
                <img src="@/assets/facette.svg">
            </router-link>

            <v-spacer></v-spacer>
        </template>

        <v-input icon="search" ref="search" type="search" :class="{float: compact}"
                :completion-handler="searchHandler" :delay="200" :placeholder="$t('label.search')" :shortkey="['/']"
                @blur="resetSearch" v-model="search.value" v-if="!compact || search.float">
            <template slot="dropdown" slot-scope="dropdown">
                <v-button :icon="item.icon || null" :key="idx" :to="item.to" @click="dropdown.select(idx)"
                        @mouseenter.native="dropdown.focus(idx, true)" v-for="(item, idx) in dropdown.items">
                    {{ item.label }}
                    <div class="section" v-if="item.section">{{ item.section }}</div>
                </v-button>
            </template>
        </v-input>

        <template v-if="!search.float">
            <v-button icon="search" @click="showSearch" v-if="compact"></v-button>

            <v-spacer v-else></v-spacer>

            <v-button dropdown-placement="bottom-left" icon="ellipsis-v">
                <template slot="dropdown">
                    <v-button icon="door-open" :to="{name: 'root'}" v-if="$route.name.startsWith('admin-')">
                        {{ $t("label.admin_panel.exit") }}</v-button>
                    <v-button icon="cog" :to="{name: 'admin-root'}" v-else>{{ $t("label.admin_panel._") }}</v-button>
                    <template v-if="fullscreenSupport">
                        <v-separator></v-separator>
                        <v-button :icon="fullscreen ? 'compress' : 'expand'" :shortkey="['shift', 'f']"
                            @click="toggleFullscreen">
                            {{ $t(`label.fullscreen.${fullscreen ? "exit" : "enter"}`) }}</v-button>
                    </template>
                    <v-separator></v-separator>
                    <v-button icon="info-circle" @click="showHelp">{{ $t("label.help") }}</v-button>
                    <v-button icon="sliders-h" :to="{name: 'settings-root'}">{{ $t("label.settings.goto") }}</v-button>
                </template>
            </v-button>
        </template>
    </v-toolbar>
</template>

<script>
export default {
    name: "v-toolbar-main",
    data() {
        return {
            fullscreen: false,
            search: {
                float: false,
                value: null,
            },
        };
    },
    computed: {
        compact() {
            return this.$mq != "large";
        },
        fullscreenSupport() {
            return document.fullscreenEnabled;
        },
    },
    methods: {
        resetSearch() {
            Object.assign(this.search, {
                float: false,
                value: null,
            });
        },
        searchHandler(term) {
            term = term.toLowerCase();

            return new Promise((resolve) => {
                resolve(this.locations.filter(a => a["label"].toLowerCase().indexOf(term) != -1));
            });
        },
        showHelp() {
            this.$events.$emit("show-help");
        },
        showSearch() {
            this.search.float = true;
            this.$nextTick(() => { this.$refs.search.focus(); });
        },
        toggleFullscreen() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
                this.fullscreen = false;
            } else {
                document.documentElement.requestFullscreen();
                this.fullscreen = true;
            }
        },
        toggleSidebar() {
            this.$store.commit("sidebar", !this.$store.getters.sidebar);
            if (!this.compact) {
                this.$nextTick(() => { window.dispatchEvent(new Event("resize")); });
            }
        },
    },
    mounted() {
        this.locations = [
            {
                icon: "home",
                label: this.$t("label.home"),
                to: {name: "root"},
            },
            {
                icon: "cog",
                label: this.$t("label.admin_panel._"),
                to: {name: "admin-root"},
            },
            {
                icon: "sliders-h",
                label: this.$t("label.settings._"),
                to: {name: "settings-root"},
            },
            {
                icon: "th-large",
                label: this.$t("label.collections._"),
                section: this.$t("label.admin_panel._"),
                to: {name: "admin-collections-list"},
            },
            {
                icon: "chart-area",
                label: this.$t("label.graphs._"),
                section: this.$t("label.admin_panel._"),
                to: {name: "admin-graphs-list"},
            },
            {
                icon: "dot-circle",
                label: this.$t("label.metrics._"),
                section: this.$t("label.admin_panel._"),
                to: {name: "admin-metrics-list"},
            },
            {
                icon: "plug",
                label: this.$t("label.providers._"),
                section: this.$t("label.admin_panel._"),
                to: {name: "admin-providers-list"},
            },
            {
                icon: "info-circle",
                label: this.$t("label.info._"),
                section: this.$t("label.admin_panel._"),
                to: {name: "admin-info"},
            },
        ];
    },
};
</script>

<style lang="scss" scoped>
.v-toolbar {
    .logo {
        align-items: center;
        display: flex;
        width: 80px;

        img {
            height: 24px;
        }
    }

    .v-input.float {
        flex-grow: 1;
    }

    /deep/ .v-dropdown {
        .v-button .content {
            display: flex;

            .section {
                flex-grow: 1;
                opacity: 0.35;
                text-align: right;
            }
        }
    }
}
</style>
