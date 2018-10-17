<template>
    <div class="v-app" :class="{toolbar: hasToolbar}">
        <slot></slot>
    </div>
</template>

<script>
import themes from "./themes";

export default {
    name: "v-app",
    props: {
        theme: {
            default: "dark",
            type: String,
        },
    },
    data() {
        return {
            hasToolbar: false,
        };
    },
    mounted() {
        this.hasToolbar = !!this.$el.querySelector(":scope .v-toolbar.main");
    },
    watch: {
        $route() {
            // Wait for route change to be completed then check for toolbar presence
            this.$nextTick(() => { this.hasToolbar = !!this.$el.querySelector(":scope .v-toolbar.main"); });
        },
        theme: {
            handler(to) {
                let theme = themes[to];
                if (!theme) {
                    return null;
                }

                Object.keys(theme).forEach((key) => {
                    // Apply application background to body
                    if (key == "app-background-color") {
                        document.body.style.backgroundColor = theme[key];
                    }

                    if (key != "name") {
                        document.body.style.setProperty(`--${key}`, theme[key]);
                    }
                });
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.v-app {
    background-color: var(--app-background-color);
    color: var(--app-color);
    display: flex;
    height: 100vh;
    overflow-y: auto;

    &.toolbar {
        .v-content,
        .v-sidebar {
            margin-top: 3rem;
        }

        .v-sidebar + .v-content {
            /deep/ {
                > .v-toolbar {
                    top: 3rem;
                }
            }
        }
    }

    .v-sidebar.fixed.active + .v-content {
        margin-left: 18rem;
        width: calc(100vw - 18rem);

        /deep/ {
            > .v-toolbar  {
                left: 18rem;
            }
        }
    }

    .v-sidebar.float.active + .v-content {
        pointer-events: none;
    }

    .v-toolbar {
        background-color: var(--app-toolbar-background-color);
        color: var(--app-toolbar-color);
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 150;

        /deep/ {
            > .v-button > a {
                color: var(--button-highlight-color);

                &:active,
                &:focus,
                &:hover {
                    background-color: var(--button-highlight-focus-background-color);
                }
            }

            .v-input,
            .v-input > .v-icon {
                color: var(--app-toolbar-color);
            }

            .v-input {
                background-color: var(--button-highlight-focus-background-color);
                width: 28rem;

                &.focus {
                    background-color: var(--dropdown-background-color);

                    > .v-icon {
                        color: var(--input-icon-color);
                    }
                }
            }
        }
    }

    ::placeholder {
        opacity: var(--app-placeholder-opacity);
    }

    ::selection {
        background-color: var(--app-selection-background-color);
    }
}
</style>
