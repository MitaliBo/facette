<template>
    <v-content>
        <v-modal-clone v-model="modals.clone"></v-modal-clone>
        <v-modal-confirm v-model="modals.confirm"></v-modal-confirm>

        <v-toolbar>
            <template v-if="!filter.float">
                <template v-if="params.section != 'catalog'">
                    <v-button icon="plus">{{ $t(`label.${params.type}.create`) }}</v-button>
                    <template v-if="params.type == 'providers'">
                        <v-button icon="play" :disabled="selection.items.length === 0 || selection.states.length == 1 &&
                            selection.states[0] === true" @click="toggleProviders(selection.items, true)">
                            {{ $t("label.providers.enable") }}</v-button>
                        <v-button icon="stop" :disabled="selection.items.length === 0 || selection.states.length == 1 &&
                            selection.states[0] === false" @click="toggleProviders(selection.items, false)">
                            {{ $t("label.providers.disable") }}</v-button>
                        <v-button icon="sync" :disabled="selection.items.length === 0 || selection.states.length == 1 &&
                            selection.states[0] === false">{{ $t("label.providers.refresh") }}</v-button>
                    </template>
                    <v-button icon="trash" :disabled="selection.items.length === 0"
                        @click="deleteItems(selection.items, false)">{{ $t("label.delete") }}</v-button>
                </template>

                <v-spacer></v-spacer>

                <v-button icon="filter" :badge="filter.value ? '⋯' : ''" @click="showFilter(true)"
                    v-if="compact"></v-button>
            </template>

            <v-input icon="filter" ref="filter" type="search" :class="{float: compact}" :delay="200"
                :placeholder="$t(`label.${params.type}.filter`)" :shortkey="['f']" @blur="showFilter(false)"
                v-model="filter.value" v-if="!compact || filter.float"></v-input>
        </v-toolbar>

        <v-spinner :size="48" v-if="loading"></v-spinner>

        <template v-else>
            <h1>{{ $t(`label.${params.type}._`) }}</h1>

            <v-tabset v-model="kind" v-if="params.type == 'collections' || params.type == 'graphs'">
                <v-tab value="raw">{{ $t(`label.${params.type}._`) }}</v-tab>
                <v-tab value="template">{{ $t("label.templates") }}</v-tab>
            </v-tabset>

            <v-message type="placeholder" v-if="items.length === 0">
                {{ $t(`mesg.${params.type}.none`) }}</v-message>

            <v-list :class="{compact: compact}" :selectable="params.section != 'catalog'"
                    @selection="handleSelection" v-model="items" v-else>
                <template slot="header">
                    <v-list-tile class="main">
                        <div class="name sort" @click="sortable && toggleSort('name')">
                            {{ $t("label.name") }}
                            <v-icon :icon="`chevron-${sort == '-name' ? 'down' : 'up'}`"
                                v-if="sortable && (sort == 'name' || sort == '-name')"></v-icon>
                        </div>
                    </v-list-tile>
                    <v-list-tile v-if="params.section != 'catalog' && !compact">
                        <div class="sort" @click="sortable && toggleSort('modified')">
                            {{ $t("label.last_modified") }}
                            <v-icon :icon="`chevron-${sort == '-modified' ? 'down' : 'up'}`"
                                v-if="sortable && (sort == 'modified' || sort == '-modified')"></v-icon>
                        </div>
                    </v-list-tile>
                    <v-list-tile class="actions"></v-list-tile>
                </template>
                <template slot-scope="item">
                    <v-list-tile class="main">
                        <div class="name">
                            <span>{{ item.name }}</span>
                            <v-icon class="link" icon="link" v-tooltip.bottom="$t('mesg.templates.instance')"
                                v-if="params.type == 'collections' || params.type == 'graphs' && item.link"></v-icon>
                            <template v-else-if="params.type == 'providers'">
                                <v-icon class="disabled" icon="stop-circle"
                                    v-tooltip.bottom="$t('mesg.providers.disabled')" v-if="!item.enabled"></v-icon>
                                <v-icon class="error" icon="times-circle"
                                    v-tooltip.bottom="$t('mesg.error', [item.error])" v-else-if="item.error"></v-icon>
                                <v-icon class="enabled" icon="check-circle"
                                    v-tooltip.bottom="$t('mesg.providers.enabled')" v-else></v-icon>
                            </template>
                        </div>
                    </v-list-tile>
                    <v-list-tile v-if="params.section != 'catalog' && !compact">
                        {{ formatTime(item.modified, $t("date.long")) }}</v-list-tile>
                    <v-list-tile class="actions" :class="{reveal: params.section == 'catalog'}">
                        <v-button icon="info-circle" v-if="params.section == 'catalog'"></v-button>
                        <v-button dropdown-placement="left" icon="ellipsis-v" v-else>
                            <template slot="dropdown">
                                <v-button icon="clone" @click="cloneItem(item, null)">
                                    {{ $t("label.clone") }}</v-button>
                                <v-button icon="trash" @click="deleteItems([item], false)">
                                    {{ $t("label.delete") }}</v-button>
                                <template v-if="(params.type == 'collections' || params.type == 'graphs') &&
                                    kind != 'template'">
                                    <v-separator></v-separator>
                                    <v-button icon="arrow-alt-circle-right" :to="{name: `browse-${params.type}`,
                                        params: {id: item.id}}">{{ $t(`label.goto.${params.type}`) }}</v-button>
                                </template>
                                <template v-if="params.type == 'providers'">
                                    <v-separator></v-separator>
                                    <v-button icon="play" @click="toggleProviders([item], true)"
                                        v-if="!item.enabled">{{ $t("label.providers.enable") }}</v-button>
                                    <v-button icon="stop" @click="toggleProviders([item], false)"
                                        v-else>{{ $t("label.providers.disable") }}</v-button>
                                    <v-button icon="sync" :disabled="!item.enabled">
                                        {{ $t("label.providers.refresh") }}</v-button>
                                </template>
                            </template>
                        </v-button>
                    </v-list-tile>
                </template>
            </v-list>

            <v-paging :adjacency="compact ? 1 : 2" :handler="switchPage" :page="page" :page-size="limit"
                :total="total"></v-paging>
        </template>
    </v-content>
</template>

<script>
import moment from "moment";
import uniq from "lodash/uniq";

export default {
    data() {
        return {
            errored: false,
            filter: {
                float: false,
                value: null,
            },
            items: [],
            kind: "raw",
            limit: 50,
            loading: false,
            modals: {
                clone: {
                    name: null,
                    type: null,
                },
                confirm: {
                    button: {
                        class: null,
                        label: null,
                    },
                    message: null,
                },
            },
            page: 1,
            selection: {
                items: [],
            },
            sort: "name",
            total: 0,
        };
    },
    computed: {
        compact() {
            return this.$mq != "large";
        },
        params() {
            return this.$route.params;
        },
        sortable() {
            return this.params.section != "catalog";
        },
    },
    methods: {
        cloneItem(item, name = null) {
            if (name) {
                this.$http.post(`/api/v1${this.params.type != "providers" ?
                    `/${this.params.section}` : ""}/${this.params.type}?inherit=${item.id}`, {
                    name: name,
                }).then(() => {
                    this.fetchItems();
                }).catch((response) => {
                    this.$notifier.enqueue(this.$t("mesg.action_error", [response.statusText]), "error");
                });
                return;
            }

            Object.assign(this.modals.clone, {
                name: `${item.name}-clone`,
                type: this.params.type,
            });

            this.$modal.show("clone", (name) => { this.cloneItem(item, name); });
        },
        deleteItems(items, apply = false) {
            if (apply) {
                this.$http.post("/api/v1/bulk", items.map(item => ({
                    endpoint: `${this.params.type != "providers" ?
                        `/${this.params.section}` : ""}/${this.params.type}/${item.id}`,
                    method: "DELETE",
                }))).then(response => response.json()).then((responses) => {
                    if (responses.filter(a => a.status >= 400).length > 0) {
                        this.$notifier.enqueue(this.$t("mesg.bulk_error"), "error");
                    }

                    this.fetchItems();
                }).catch((response) => {
                    this.$notifier.enqueue(this.$t("mesg.action_error", [response.statusText]), "error");
                });

                return;
            }

            Object.assign(this.modals.confirm, {
                message: this.$tc(`mesg.${this.params.type}.delete`, items.length, items.length > 1 ?
                    {count: items.length} : items[0]),
                button: {
                    label: this.$tc("label.delete", items.length),
                    class: "danger",
                },
            });

            this.$modal.show("confirm", (apply) => { this.deleteItems(items, apply); });
        },
        formatTime(time, format) {
            return moment(time).format(format);
        },
        fetchItems() {
            let params = {
                fields: "id,name,modified",
                limit: this.limit,
                offset: (this.page - 1) * this.limit,
            };

            if (this.params.type == "collections" || this.params.type == "graphs") {
                params.fields += ",link";
            } else if (this.params.type == "providers") {
                params.fields += ",enabled,error";
            }

            if (this.kind) {
                params.kind = this.kind;
            }

            if (this.filter.value) {
                params.filter = `glob:*${this.filter.value}*`;
            }

            if (this.sort) {
                params.sort = this.sort;
            }

            this.errored = false;
            this.loading = true;

            this.$http.get(`/api/v1${this.params.type != "providers" ?
                `/${this.params.section}` : ""}/${this.params.type}`, {
                params: params,
            }).then((response) => {
                this.total = parseInt(response.headers.get("X-Total-Records"), 10);
                return response.json();
            }).then((response) => {
                this.items = this.params.section == "catalog" ? response.map(a => ({name: a})) : response;
                this.loading = false;
            }).catch(() => {
                this.errored = true;
                this.loading = false;
            });
        },
        handleSelection(selection) {
            selection = {
                items: selection,
            };

            if (this.params.type == "providers") {
                Object.assign(selection, {
                    states: uniq(selection.items.map(item => item.enabled)),
                });
            }

            this.selection = selection;
        },
        showFilter(state) {
            this.filter.float = state;
            if (state) {
                this.$nextTick(() => { this.$refs.filter.focus(); });
            }
        },
        switchPage(number) {
            this.page = number;
        },
        toggleProviders(items, state, apply = false) {
            if (apply) {
                this.$http.post("/api/v1/bulk", items.map(item => ({
                    endpoint: `/providers/${item.id}`,
                    method: "PATCH",
                    data: {
                        enabled: state,
                    },
                }))).then(response => response.json()).then((responses) => {
                    if (responses.filter(a => a.status >= 400).length > 0) {
                        this.$notifier.enqueue(this.$t("mesg.bulk_error"), "error");
                    }

                    this.fetchItems();
                }).catch((response) => {
                    this.$notifier.enqueue(this.$t("mesg.action_error", [response.statusText]), "error");
                });

                return;
            }

            Object.assign(this.modals.confirm, {
                message: this.$tc(`mesg.providers.${state ? "enable" : "disable"}`, items.length,
                    items.length > 1 ? {count: items.length} : items[0]),
                button: {
                    label: this.$tc(`label.providers.${state ? "enable" : "disable"}`, items.length),
                    class: state ? "highlight" : "danger",
                },
            });

            this.$modal.show("confirm", (apply) => { this.toggleProviders(items, state, apply); });
        },
        toggleSort(key) {
            let desc = this.sort.startsWith("-"),
                sort = desc ? this.sort.substr(1) : this.sort;

            this.sort = key == sort && !desc ? `-${key}` : key;
        },
    },
    mounted() {
        this.$title.set(`${this.$t(`label.${this.params.type}._`)} – ${this.$t("label.admin_panel._")}`);
    },
    watch: {
        "$route.query": {
            handler(to) {
                let props = {
                    filter: {
                        float: this.filter.float,
                        value: to.filter || null,
                    },
                    kind: to.kind || "raw",
                    page: parseInt(to.page, 10) || 1,
                    sort: to.sort || "name",
                };

                Object.assign(this, props);
                this.fetchItems();
            },
            immediate: true,
        },
        "filter.value"(to) {
            this.page = 1;
            this.$params.set("filter", to, to);
        },
        kind(to) {
            this.page = 1;
            this.$params.set("kind", to, to != "raw");
        },
        page(to) {
            this.$params.set("page", to, to > 1);
        },
        "params.type"(to) {
            this.$title.set(`${this.$t(`label.${to}._`)} – ${this.$t("label.admin_panel._")}`);
            this.fetchItems();
        },
        sort(to) {
            this.$params.set("sort", to, to != "name");
        },
    },
};
</script>

<style lang="scss" scoped>
.v-input.float {
    flex-grow: 1;
}

.v-list {
    &.compact {
        .name span {
            max-width: 75vw;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .name,
    .sort {
        align-items: center;
        display: flex;
    }

    .name .v-icon {
        margin-left: 0.5rem;

        &.disabled,
        &.link {
            color: var(--message-placeholder-color);
        }

        &.enabled {
            color: var(--message-success-background-color);
        }

        &.error {
            color: var(--message-error-background-color);
        }
    }

    .sort {
        cursor: pointer;

        .v-icon {
            margin-left: 0.35rem;
        }
    }
}
</style>
