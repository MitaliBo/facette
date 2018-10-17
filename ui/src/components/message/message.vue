<template>
    <div class="v-message" :class="{inline: inline, [type]: true}">
        <v-icon :icon="icon || defaultIcon" v-if="icon || defaultIcon"></v-icon>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "v-message",
    props: {
        icon: {
            type: [Array, String],
        },
        inline: {
            type: Boolean,
        },
        type: {
            type: String,
        },
    },
    data() {
        return {
            defaultIcon: null,
        };
    },
    mounted() {
        if (this.icon) {
            return;
        }

        switch (this.type) {
        case "error":
            this.defaultIcon = "times-circle";
            break;

        case "info":
            this.defaultIcon = "info-circle";
            break;

        case "success":
            this.defaultIcon = "check-circle";
            break;

        case "warning":
            this.defaultIcon = "exclamation-circle";
            break;
        }
    },
};
</script>

<style lang="scss" scoped>
.v-message {
    border-radius: 0.15rem;
    display: flex;
    padding: 0.5rem 1rem;

    &.inline {
        display: inline-flex;
    }

    &.error {
        background-color: var(--message-error-background-color);
        color: var(--message-error-color);
    }

    &.info {
        background-color: var(--message-info-background-color);
        color: var(--message-info-color);
    }

    &.placeholder {
        background-color: var(--message-placeholder-background-color);
        color: var(--message-placeholder-color);
    }

    &.success {
        background-color: var(--message-success-background-color);
        color: var(--message-success-color);
    }

    &.warning {
        background-color: var(--message-warning-background-color);
        color: var(--message-warning-color);
    }

    .v-icon {
        margin-right: 0.5rem;
    }
}
</style>
