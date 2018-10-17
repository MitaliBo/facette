<template>
    <v-content>
        <v-toolbar :direction="compact ? 'row' : 'column'" v-if="basketCount > 0 && params.type != 'basket'">
            <v-spacer></v-spacer>
            <v-button icon="shopping-basket" :badge="basketCount" :to="{name: 'browse-basket'}"></v-button>
        </v-toolbar>

        <div></div>
    </v-content>
</template>

<script>
export default {
    computed: {
        basketCount() {
            return this.$store.getters.basket ? this.$store.getters.basket.length : 0;
        },
        compact() {
            return this.$mq != "large";
        },
        params() {
            return this.$route.params;
        },
    },
    mounted() {
        this.$title.set(null);
    },
};
</script>
