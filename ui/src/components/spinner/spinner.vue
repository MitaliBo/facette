<template>
    <vue-simple-spinner class="v-spinner" :line-bg-color="backgroundColor" :line-fg-color="color" :line-size="lineSize"
        :size="size"></vue-simple-spinner>
</template>

<script>
import vue from "vue";
import vueSimpleSpinner from "vue-simple-spinner";

vue.component(vueSimpleSpinner.name, vueSimpleSpinner);

export default {
    name: "v-spinner",
    props: {
        backgroundColor: {
            default: "var(--spinner-background-color)",
            type: String,
        },
        color: {
            default: "var(--spinner-color)",
            type: String,
        },
        lineSize: {
            default: 3,
            type: Number,
        },
        size: {
            default: 32,
            type: Number,
        },
    },
};
</script>
