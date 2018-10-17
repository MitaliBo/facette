<template>
    <div class="v-sidebar" :class="{active: active, [mode]: true}">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "v-sidebar",
    props: {
        active: {
            type: Boolean,
        },
        value: {
            type: Boolean,
        },
    },
    computed: {
        mode() {
            return this.$mq == "large" ? "fixed" : "float";
        },
    },
};
</script>

<style lang="scss" scoped>
.v-sidebar {
    background-color: var(--sidebar-background-color);
    bottom: 0;
    color: var(--sidebar-color);
    left: 0;
    overflow-y: auto;
    padding: 1.5rem 0;
    position: fixed;
    top: 0;
    transform: translateX(-100%);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    width: 18rem;
    will-change: transform;
    z-index: 100;

    &.active {
        transform: translateX(0);

        &.float {
            box-shadow: 0 0.15rem 1rem var(--modal-content-box-shadow-color),
                        0 0 0 100vw var(--modal-background-color);
            width: 90vw;
        }
    }

    .v-button /deep/ .content,
    .v-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .v-button {
        display: block;

        &.top {
            background-color: var(--sidebar-button-active-background-color);
            height: 3rem;
            line-height: 3rem;
            position: sticky;
            top: 0;
            transform: translateY(-1.5rem);
        }

        /deep/ a {
            border-radius: 0;
            color: var(--sidebar-color);
            justify-content: flex-start;
            padding: 0 1.5rem;

            &:active,
            &:focus,
            &:hover {
                background-color: var(--sidebar-button-focus-background-color);
            }

            &.active {
                background-color: var(--sidebar-button-active-background-color);
                box-shadow: inset -0.25rem 0 0 var(--sidebar-button-active-box-shadow-color);
            }
        }

        & + .v-button {
            margin-left: 0;
        }
    }

    .v-label {
        color: var(--sidebar-label-color);
        letter-spacing: 0.05rem;
        line-height: 2.5rem;
        padding: 0 1.5rem;
    }

    .v-message {
        margin: 1.5rem 1.5rem 0;
    }

    .v-spinner {
        align-items: center;
        bottom: 0;
        display: flex;
        justify-content: center;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
    }

    > :last-child {
        margin-bottom: 1.5rem;
    }
}
</style>
