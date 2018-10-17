<template>
    <v-modal name="clone">
        <v-form slot-scope="modal">
            <v-label>{{ $t(`label.${value.type}.name`) }}</v-label>
            <v-input v-model="value.name"></v-input>

            <template slot="actions">
                <v-button @click="modal.close(null)">{{ $t("label.cancel") }}</v-button>
                <v-button class="highlight" @click="modal.close(value.name)">{{ $t("label.clone") }}</v-button>
            </template>
        </v-form>
    </v-modal>
</template>

<script>
export default {
    name: "v-modal-clone",
    props: {
        value: {
            required: true,
            type: Object,
        },
    },
};
</script>
