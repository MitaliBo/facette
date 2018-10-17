<template>
    <v-app :theme="theme" @shortkey.native="showHelp" v-shortkey="['shift', '?']">
        <v-modal-help></v-modal-help>
        <v-notifier></v-notifier>

        <router-view name="toolbar"></router-view>
        <router-view name="sidebar"></router-view>
        <router-view></router-view>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            storeUnwatch: null,
        };
    },
    computed: {
        theme() {
            return this.$store.getters.theme;
        },
    },
    methods: {
        showHelp() {
            this.$modal.show("help");
        },
    },
    beforeCreate() {
        this.$i18n.locale = this.$store.getters.locale;
        this.storeUnwatch = this.$store.watch(state => state.locale, (to) => { this.$i18n.locale = to; });
    },
    created() {
        this.$events.$on("show-help", this.showHelp);
    },
    beforeDestroy() {
        this.$events.$off("show-help", this.showHelp);

        if (this.storeUnwatch) {
            this.storeUnwatch();
        }
    },
};
</script>

<style lang="scss">
@font-face {
    font-display: swap;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 300;
    src: local("Roboto Light"),
         local("Roboto-Light"),
         url("~typeface-roboto/files/roboto-latin-300.woff2") format("woff2"),
         url("~typeface-roboto/files/roboto-latin-300.woff") format("woff");
}

@font-face {
    font-display: swap;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    src: local("Roboto Regular"),
         local("Roboto-Regular"),
         url("~typeface-roboto/files/roboto-latin-400.woff2") format("woff2"),
         url("~typeface-roboto/files/roboto-latin-400.woff") format("woff");
}

@font-face {
    font-display: swap;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 500;
    src: local("Roboto Medium"),
         local("Roboto-Medium"),
         url("~typeface-roboto/files/roboto-latin-500.woff2") format("woff2"),
         url("~typeface-roboto/files/roboto-latin-500.woff") format("woff");
}

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    min-height: 100vh;
    padding: 0;
}

body {
    font-family: "Roboto", sans-serif;
    font-size: 13px;
    line-height: 1.5;
}

a {
    color: inherit;
}

b, h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
}

@media (max-width: 800px) {
    body {
        font-size: 16px;
    }
}
</style>
