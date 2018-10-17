<template>
    <v-modal name="refresh">
        <v-form slot-scope="modal" :title="$t('label.refresh.automatic')">
            <v-label>{{ $t("label.refresh.interval") }}</v-label>
            <v-input ref="refresh" type="number" :help="$t('help.refresh.interval')" :required="true"
                v-model="value.interval"></v-input>

            <template slot="actions">
                <v-button @click="modal.close(null)">{{ $t("label.cancel") }}</v-button>
                <v-button class="highlight" :disabled="$refs.refresh && !$refs.refresh.checkValidity()"
                    @click="modal.close(value.interval)">{{ $t("label.set") }}</v-button>
            </template>
        </v-form>
    </v-modal>
</template>

<script>
export default {
    name: "v-modal-refresh",
    props: {
        value: {
            required: true,
            type: Object,
        },
    },
};
</script>
