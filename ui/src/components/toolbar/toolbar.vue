<template>
    <div class="v-toolbar" :class="{compact: compact, [direction]: true}">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "v-toolbar",
    props: {
        direction: {
            default: "row",
            type: String,
        },
    },
    computed: {
        compact() {
            return this.$mq != "large";
        },
    },
};
</script>

<style lang="scss" scoped>
.v-toolbar {
    align-items: center;
    background-color: var(--toolbar-background-color);
    display: flex;
    height: 3rem;
    line-height: 3rem;
    min-height: 3rem;

    &.column {
        flex-direction: column;
        height: auto;
        width: 3rem;

        > .v-separator {
            height: 1px;
            width: 2rem;
        }

        > .v-button + .v-button {
            margin-top: 0;
        }
    }

    &.row {
        > .v-button + .v-button {
            margin-left: 0;
        }
    }

    &.compact > .v-button /deep/ {
        > a > .content {
            display: none;
        }
    }

    > .v-button {
        height: 2.25rem;
        line-height: 2.25rem;
        margin: 0.375rem;

        /deep/ {
            > a {
                padding: 0 0.75rem;

                &:active,
                &:focus,
                &:hover {
                    background-color: var(--toolbar-button-focus-background-color);
                }
            }
        }

        &.icon {
            width: 2.25rem;

            /deep/ {
                > a {
                    padding: 0;

                    .v-icon {
                        padding: 0 0.75rem;
                    }
                }
            }
        }
    }

    > .v-input {
        background-color: var(--toolbar-input-background-color);
        border: none;
        margin: 0.625rem;
        width: 20rem;

        &.focus {
            background-color: var(--input-background-color);
            color: var(--input-color);

            .v-icon {
                color: var(--input-icon-color);
            }

            ::placeholder {
                opacity: var(--app-placeholder-opacity);
            }
        }

        ::placeholder {
            opacity: 0;
        }
    }

    > .v-separator {
        background-color: var(--toolbar-separator-background-color);
        height: 2rem;
        width: 1px;
    }
}
</style>
