<template>
    <div class="v-dropdown" :class="placement">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "v-dropdown",
    props: {
        placement: {
            default: "bottom-right",
            type: String,
        },
    },
};
</script>

<style lang="scss" scoped>
.v-dropdown {
    background-color: var(--dropdown-background-color);
    border-radius: 0.15rem;
    box-shadow: 0 0.15rem 0.5rem var(--dropdown-box-shadow-color);
    color: var(--app-color);
    cursor: default;
    display: flex;
    flex-direction: column;
    line-height: 2rem;
    padding: 0.35rem 0;
    position: absolute;
    z-index: 300;

    &.bottom-left,
    &.bottom-right {
        top: 100%;
    }

    &.bottom-left {
        right: 0;
    }

    &.bottom-right {
        left: 0;
    }

    &.left,
    &.right {
        top: 0;
    }

    &.right {
        left: 100%;
    }

    &.left {
        right: 100%;
    }

    .v-button {
        display: block;
        line-height: 1.75rem;

        &.active /deep/ a,
        /deep/ a:focus,
        /deep/ a:hover {
            background-color: var(--dropdown-focus-background-color);
            color: var(--dropdown-focus-color);

            > .v-icon {
                color: var(--dropdown-focus-color);
            }
        }

        /deep/ a {
            color: var(--dropdown-button-color);
            border-radius: 0;

            .v-icon {
                color: var(--dropdown-icon-color);
                min-width: 1.25rem;
                width: 1.25rem;
            }
        }

        & + .v-button {
            margin: 0;
        }
    }

    .v-separator {
        background-color: var(--dropdown-separator-background-color);
        height: 1px;
        margin: 0.35rem 0;
    }
}
</style>
