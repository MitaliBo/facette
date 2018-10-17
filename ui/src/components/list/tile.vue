<template>
    <td class="v-list-tile">
        <slot></slot>
    </td>
</template>

<script>
export default {
    name: "v-list-tile",
};
</script>

<style lang="scss" scoped>
.v-list-tile {
    border-bottom: 1px solid var(--list-border-color);
    padding: 0 1.5rem 0 0.5rem;
    white-space: nowrap;

    &.actions {
        padding: 0 0 0 0.25rem;

        .v-button /deep/ {
            align-items: center;
            display: flex;

            > a {
                height: 1.5rem;
                line-height: 1.5rem;
                width: 1.5rem;
            }
        }
    }

    &.reveal * {
        opacity: 0;
    }

    // &.grip,
    &.select {
        padding: 0 0.25rem;
        user-select: none;
    }

    // &.grip {
    //     color: var(--list-grip-color);
    // }

    &.main {
        width: 100%;
    }

    .v-button,
    .v-checkbox,
    .v-input {
        vertical-align: middle;
    }

    .v-input {
        transform: translateY(-1px);
    }
}
</style>
