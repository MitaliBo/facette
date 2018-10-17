<template>
    <div class="v-label">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "v-label",
};
</script>

<style lang="scss" scoped>
.v-label {
    line-height: 2rem;
}
</style>
