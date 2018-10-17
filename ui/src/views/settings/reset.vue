<template>
    <v-content>
        <v-modal-confirm v-model="modals.confirm"></v-modal-confirm>

        <v-toolbar></v-toolbar>

        <h1>{{ $t("label.settings.reset.alt") }}</h1>

        <v-form>
            <v-message type="warning" :inline="true">{{ $t("help.settings.reset") }}</v-message>

            <template slot="actions">
                <v-button class="highlight" icon="trash" @click="reset">{{ $t("label.reset._") }}</v-button>
            </template>
        </v-form>
    </v-content>
</template>

<script>
export default {
    data() {
        return {
            modals: {
                confirm: {
                    button: {
                        class: null,
                        label: null,
                    },
                    message: null,
                },
            },
        };
    },
    methods: {
        reset() {
            Object.assign(this.modals.confirm, {
                message: this.$t("mesg.settings.reset"),
                button: {
                    label: this.$t("label.reset._"),
                    class: "danger",
                },
            });

            this.$modal.show("confirm", () => {
                localStorage.removeItem("facette");
                location.reload();
            });
        },
    },
    mounted() {
        this.$title.set(this.$t("label.settings._"));
    },
};
</script>
