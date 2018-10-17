<template>
    <v-modal name="range">
        <v-form slot-scope="modal" :title="$t('label.timerange._')">
            <v-tabset v-model="value.type" @input="modal.focus">
                <v-tab value="relative">{{ $t("label.timerange.relative") }}</v-tab>
                <v-tab value="absolute">{{ $t("label.timerange.absolute") }}</v-tab>
            </v-tabset>

            <template v-if="value.type == 'relative'">
                <v-label>{{ $t("label.timerange.ref_time") }}</v-label>
                <v-datetime placeholder="now" v-model="value.time"></v-datetime>

                <v-label>{{ $t("label.timerange._") }}</v-label>
                <v-input :placeholder="defaults.time_range" v-model="value.range"></v-input>
            </template>

            <template v-else-if="value.type == 'absolute'">
                <v-label>{{ $t("label.timerange.start_time") }}</v-label>
                <v-datetime :placeholder="$t('label.timerange.select_time')"
                    v-model="value.start_time"></v-datetime>

                <v-label>{{ $t("label.timerange.end_time") }}</v-label>
                <v-datetime :placeholder="$t('label.timerange.select_time')"
                    v-model="value.end_time"></v-datetime>
            </template>

            <template slot="actions">
                <v-button @click="modal.close(null)">{{ $t("label.cancel") }}</v-button>
                <v-button class="highlight" @click="handle(modal)">{{ $t("label.set") }}</v-button>
            </template>
        </v-form>
    </v-modal>
</template>

<script>
import moment from "moment";

import {dateFormatRFC3339} from "./graph";

export default {
    name: "v-modal-range",
    props: {
        value: {
            required: true,
            type: Object,
        },
    },
    computed: {
        defaults() {
            return this.$store.getters.defaults;
        },
        params() {
            return this.$route.params;
        },
    },
    methods: {
        handle(modal) {
            if (this.value.type == "absolute") {
                modal.close({
                    start_time: moment(this.value.start_time).format(dateFormatRFC3339),
                    end_time: moment(this.value.end_time).format(dateFormatRFC3339),
                });
            } else if (this.value.type == "relative") {
                let range = {};
                if (this.value.time) {
                    range.time = moment(this.value.time).format(dateFormatRFC3339);
                }
                if (this.value.range) {
                    range.range = this.value.range;
                }

                modal.close(range);
            }
        },
    },
};
</script>
