<template>
    <div class="v-graph-zoom"></div>
</template>

<script>
export default {
    name: "v-graph-zoom",
    methods: {
        update(style) {
            Object.assign(this.$el.style, style);
        },
    },
};
</script>

<style lang="scss" scoped>
.v-graph-zoom {
    background-color: var(--graph-zoom-background-color);
    display: none;
    height: 1px;
    pointer-events: none;
    position: absolute;
    width: 1px;
    will-change: height, left, top, width;
}
</style>
