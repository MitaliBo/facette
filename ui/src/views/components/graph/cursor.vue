<template>
    <div class="v-graph-cursor"></div>
</template>

<script>
export default {
    name: "v-graph-cursor",
    methods: {
        update(style) {
            Object.assign(this.$el.style, style);
        },
    },
};
</script>

<style lang="scss" scoped>
.v-graph-cursor {
    border-left: 1px dashed var(--graph-cursor-border-color);
    display: none;
    height: 1px;
    pointer-events: none;
    position: absolute;
    width: 0;
    will-change: height, left, top;
}
</style>
