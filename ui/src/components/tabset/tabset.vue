<template>
    <div class="v-tabset">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "v-tabset",
    props: {
        value: {
            required: true,
        },
    },
    methods: {
        select(value) {
            this.$emit("input", value);
        },
    },
};
</script>

<style lang="scss" scoped>
.v-tabset {
    border-bottom: 1px solid var(--tabset-border-color);
    display: flex;
    line-height: 2rem;
    margin-bottom: 1rem;
}
</style>
