<template>
    <v-modal name="confirm">
        <v-form slot-scope="modal">
            <v-label>{{ value.message }}</v-label>

            <template slot="actions">
                <v-button @click="modal.close(false)">{{ $t("label.cancel") }}</v-button>
                <v-button :class="value.button.class || 'highlight'" @click="modal.close(true)">
                    {{ value.button.label || $t("label.ok") }}</v-button>
            </template>
        </v-form>
    </v-modal>
</template>

<script>
export default {
    name: "v-modal-confirm",
    props: {
        value: {
            required: true,
            type: Object,
        },
    },
};
</script>
