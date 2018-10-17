<template>
    <v-sidebar :active="sidebar">
        <v-button class="top" icon="arrow-left" :to="{name: 'browse-root'}">{{ $t("label.goto.home") }}</v-button>

        <v-label>{{ $t("label.library") }}</v-label>
        <v-button icon="th-large" :to="{name: 'admin-collections-list'}" @click.native="compact && hideSidebar()">
            {{ $t("label.collections._") }}</v-button>
        <v-button icon="chart-area" :to="{name: 'admin-graphs-list'}" @click.native="compact && hideSidebar()">
            {{ $t("label.graphs._") }}</v-button>

        <v-label>{{ $t("label.catalog") }}</v-label>
        <v-button icon="dot-circle" :to="{name: 'admin-metrics-list'}" @click.native="compact && hideSidebar()">
            {{ $t("label.metrics._") }}</v-button>

        <v-label>{{ $t("label.system") }}</v-label>
        <v-button icon="plug" :to="{name: 'admin-providers-list'}" @click.native="compact && hideSidebar()">
            {{ $t("label.providers._") }}</v-button>
        <v-button icon="info-circle" :to="{name: 'admin-info'}" @click.native="compact && hideSidebar()">
            {{ $t("label.info._") }}</v-button>

        <template v-if="readOnly">
            <v-spacer></v-spacer>
            <v-message type="warning">{{ $t("mesg.read_only_instance") }}</v-message>
        </template>
    </v-sidebar>
</template>

<script>
export default {
    computed: {
        compact() {
            return this.$mq != "large";
        },
        readOnly() {
            return this.$store.getters.readOnly;
        },
        sidebar() {
            return this.$store.getters.sidebar;
        },
    },
    methods: {
        hideSidebar() {
            this.$store.commit("sidebar", false);
        },
    },
};
</script>
