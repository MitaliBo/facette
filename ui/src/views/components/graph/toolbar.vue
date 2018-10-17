<template>
    <v-toolbar :direction="direction">
        <v-button icon="sync" :dropdown-placement="dropdownPlacement" v-if="$route.name.startsWith('show-')">
            <template slot="dropdown">
                <v-button @click="$parent.exec('update')">{{ $t("label.graphs.refresh") }}</v-button>
                <v-separator></v-separator>
                <v-button :shortkey="['r']" @click="$parent.setRefresh(null)">{{ $t("label.set_interval") }}</v-button>
            </template>
        </v-button>
        <v-button icon="sync" @click="$parent.exec('update')" v-else></v-button>
        <v-button icon="clock" :dropdown-placement="dropdownPlacement">
            <template slot="dropdown">
                <v-button icon="history" :disabled="!$parent.options.range && !$parent.options.time &&
                        !$parent.options.start_time && !$parent.options.end_time" @click="$parent.exec('resetRange')">
                    {{ $t("label.timerange.reset") }}</v-button>

                <v-separator></v-separator>

                <v-button :icon="$parent.options.range == `-${range}` ? 'check' : ''" :key="idx"
                    v-for="(range, idx) in ranges"
                    @click="$parent.exec('applyRange', {range: `-${range}`})">{{ range }}</v-button>

                <v-separator></v-separator>

                <v-button icon="calendar-alt" :shortkey="['shift', 'r']" @click="$parent.customRange(null)">
                    {{ $t("label.timerange.custom") }}</v-button>
            </template>
        </v-button>
        <v-button icon="arrows-alt-v" @click="$parent.exec('propagate')"></v-button>
        <v-button icon="search-minus" @click="$parent.exec('zoom', false)"></v-button>
        <v-button icon="search-plus" @click="$parent.exec('zoom', true)"></v-button>

        <v-separator></v-separator>

        <v-button icon="download" :dropdown-placement="dropdownPlacement">
            <template slot="dropdown">
                <v-button @click="$parent.exec('export', $event, 'png')">
                    {{ $t("label.export.png") }}</v-button>
                <v-separator></v-separator>
                <v-button @click="$parent.exec('export', $event, 'summary_csv')">
                    {{ $t("label.export.summary_csv") }}</v-button>
                <v-button @click="$parent.exec('export', $event, 'summary_json')">
                    {{ $t("label.export.summary_json") }}</v-button>
            </template>
        </v-button>
        <v-button icon="window-maximize"
            :to="{name: 'show-collections', params: {id: $route.params.id, index: $parent.index}, query: queryOptions}"
            v-if="$route.name == 'browse-collections'"></v-button>
        <v-button icon="window-maximize"
            :to="{name: 'show-graphs', params: {id: $route.params.id}, query: queryOptions}"
            v-else-if="$route.name == 'browse-graphs'"></v-button>

        <v-separator></v-separator>

        <v-button :dropdown-placement="dropdownPlacement" :icon="`ellipsis-${direction == 'row' ? 'v' : 'h'}`">
            <template slot="dropdown">
                <template v-if="!readOnly">
                    <v-button icon="pencil-alt">{{ $t("label.graphs.edit") }}</v-button>
                    <v-separator></v-separator>
                </template>
                <v-button :icon="readOnly ? null : ''" @click="$parent.exec('basket', false)"
                    v-if="$route.name == 'browse-basket'">{{ $t("label.basket.remove") }}</v-button>
                <v-button :icon="readOnly ? null : ''" @click="$parent.exec('basket', true)"
                    v-else>{{ $t("label.basket.add") }}</v-button>
                <v-button :icon="readOnly ? null : ''">{{ $t("label.reset.state") }}</v-button>
            </template>
        </v-button>
    </v-toolbar>
</template>

<script>
import moment from "moment";

import {dateFormatRFC3339, ranges} from ".";

export default {
    name: "v-graph-toolbar",
    props: {
        direction: {
            default: "row",
            type: String,
        },
    },
    computed: {
        dropdownPlacement() {
            return this.direction == "row" ? "bottom-left" : "left";
        },
        queryOptions() {
            if (this.$parent.options.start_time || this.$parent.options.end_time) {
                return {
                    start_time: moment(this.$parent.options.start_time).format(dateFormatRFC3339),
                    end_time: moment(this.$parent.options.end_time).format(dateFormatRFC3339),
                };
            }

            let query = {};
            if (this.$parent.options.time) {
                query.time = moment(this.$parent.options.time).format(dateFormatRFC3339);
            }
            if (this.$parent.options.range) {
                query.range = this.$parent.options.range;
            }

            return query;
        },
        ranges() {
            return ranges;
        },
        readOnly() {
            return this.$store.getters.readOnly;
        },
    },
};
</script>

<style lang="scss" scoped>
.v-toolbar {
    align-items: flex-start !important;
    border-bottom-left-radius: 0.15rem;
    height: 2.25rem !important;
    line-height: 1.5rem !important;
    min-height: 2.25rem !important;
    padding-left: 0.75rem;
    position: absolute;
    right: 0;
    top: 0;

    &.column {
        align-items: flex-end !important;
        border-radius: 0;
        bottom: 0;
        height: auto !important;
        padding: 0.25rem;
        width: 2.25rem !important;

        > .v-separator {
            height: 1px !important;
            margin: 0.25rem 0;
            width: 1.75rem !important;
        }
    }

    > .v-button {
        height: 1.5rem !important;
        line-height: 1.5rem !important;
        margin: 0 0.125rem !important;

        &.icon {
            width: 1.5rem !important;
        }

        /deep/ {
            > a .v-icon {
                font-size: 0.8rem;
            }
        }
    }

    > .v-separator {
        margin: 0 0.25rem;
        height: 1.5rem !important;
    }
}
</style>
