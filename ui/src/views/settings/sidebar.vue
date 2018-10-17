<template>
    <v-sidebar :active="sidebar">
        <v-button class="top" icon="arrow-left" :to="{name: 'browse-root'}">{{ $t("label.goto.home") }}</v-button>

        <v-label>{{ $t("label.settings._") }}</v-label>

        <v-button exact :to="{name: 'settings-root'}">{{ $t("label.settings.display._") }}</v-button>
        <v-button exact :to="{name: 'settings-reset'}">{{ $t("label.settings.reset._") }}</v-button>
    </v-sidebar>
</template>

<script>
export default {
    computed: {
        sidebar() {
            return this.$store.getters.sidebar;
        },
    },
};
</script>
