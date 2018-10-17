<template>
    <div class="v-content" :class="{compact: compact, [`toolbar-${hasToolbar}`]: hasToolbar}">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "v-content",
    data() {
        return {
            hasToolbar: false,
        };
    },
    computed: {
        compact() {
            return this.$mq != "large";
        },
    },
    mounted() {
        let toolbar = this.$el.querySelector(":scope .v-toolbar");

        if (toolbar) {
            this.hasToolbar = toolbar.classList.contains("column") ? "column" : "row";
        } else {
            this.hasToolbar = false;
        }
    },
};
</script>

<style lang="scss" scoped>
.v-content {
    flex-grow: 1;
    padding: 2rem;
    position: relative;
    transition: margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: margin-left, width;

    &.compact {
        padding: 1rem;

        &.toolbar-column {
            padding-left: 4rem;
        }

        &.toolbar-row {
            padding-top: 4rem;
        }
    }

    &.toolbar-column {
        padding-left: 5rem;
    }

    &.toolbar-row {
        padding-top: 5rem;
    }

    .v-message.placeholder.full,
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

    .v-message.placeholder {
        background-color: transparent;
        color: var(--content-placeholder-color);

        &.full {
            font-size: 1.25rem;
            font-weight: 300;
        }
    }

    h1 + .v-message.placeholder {
        padding: 0;
    }

    .v-toolbar {
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: left;
        z-index: 50;

        &.column {
            bottom: 0;
            right: auto;
        }
    }

    h1 {
        font-weight: normal;
        margin-top: 0;
    }

    > :last-child {
        margin-bottom: 2rem;
    }
}
</style>
