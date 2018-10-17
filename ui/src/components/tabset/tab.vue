<template>
    <div class="v-tab" tabindex="0" :class="{active: active}" @click="$parent.select(value)"
            @keydown.enter.stop="$parent.select(value)">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "v-tab",
    props: {
        value: {
            required: true,
            type: String,
        },
    },
    computed: {
        active() {
            return this.$parent.value == this.value;
        },
    },
};
</script>

<style lang="scss" scoped>
.v-tab {
    border-bottom: 2px solid transparent;
    color: var(--tabset-tab-color);
    cursor: pointer;
    padding: 0 1rem;
    transform: translateY(1px);

    &:focus,
    &.active:focus {
        border-color: var(--tabset-tab-focus-border-color);
        color: var(--tabset-tab-focus-color);
        outline: none;
    }

    &.active {
        border-color: var(--tabset-tab-active-border-color);
        color: var(--tabset-tab-active-color);
    }
}
</style>
