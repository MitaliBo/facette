<template>
    <div class="v-button" role="button" :class="{dropdown: hasDropdown, focus: focused || isActive,
            icon: !hasContent}" :disabled="disabled" @click="handleClick" @shortkey="shortkey && $event.target.click()"
            v-shortkey="shortkey">
        <router-link :exact="exact" :to="to" @blur="handleFocus" @focus="handleFocus"
                @keydown.enter="handleClick" v-if="to">
            <v-icon :badge="badge" :icon="icon" v-if="icon !== undefined && icon != null"></v-icon>
            <div class="content" v-if="hasContent">
                <slot></slot>
            </div>
        </router-link>

        <a :href="href" :tabindex="disabled ? -1 : 0" :target="target" @blur="handleFocus" @focus="handleFocus"
                @keydown.enter="handleClick" v-else>
            <v-icon :badge="badge" :icon="icon" v-if="icon !== undefined && icon != null"></v-icon>
            <div class="content" v-if="hasContent">
                <slot></slot>
            </div>
        </a>

        <v-dropdown :class="{active: isActive}" :placement="dropdownPlacement" v-if="hasDropdown">
            <slot name="dropdown"></slot>
        </v-dropdown>
    </div>
</template>

<script>
export default {
    name: "v-button",
    props: {
        badge: {
            type: [Number, String],
        },
        disabled: {
            type: Boolean,
        },
        dropdownPlacement: {
            type: String,
        },
        exact: {
            type: Boolean,
        },
        href: {
            type: String,
        },
        icon: {
            type: [Array, String],
        },
        shortkey: {
            type: Array,
        },
        target: {
            type: String,
        },
        to: {
            type: Object,
        },
    },
    data() {
        return {
            focused: false,
            isActive: false,
        };
    },
    computed: {
        hasContent() {
            return !!(this.$slots && this.$slots.default);
        },
        hasDropdown() {
            return !!(this.$slots && this.$slots.dropdown);
        },
    },
    methods: {
        handleClick(e) {
            if (this.hasDropdown) {
                if (this.$el.contains(e.target) && [this.$el, null].indexOf(e.target.closest(".v-button")) != -1) {
                    if (!this.isActive) {
                        this.isActive = true;
                        document.addEventListener("click", this.handleClick);
                    }
                } else if (this.isActive) {
                    this.isActive = false;
                    document.removeEventListener("click", this.handleClick);
                }
            }

            this.$emit("click", e);
        },
        handleFocus(e) {
            this.focused = e.type == "focus";
            this.$emit(e.type, e);
        },
    },
};
</script>

<style lang="scss" scoped>
.v-button {
    display: inline-block;
    height: 2rem;
    line-height: 2rem;
    position: relative;
    user-select: none;

    &[disabled] {
        pointer-events: none;

        > a {
            .v-icon,
            .content {
                opacity: 0.35;
            }
        }
    }

    &.danger > a {
        background-color: var(--button-danger-background-color);
        color: var(--button-danger-color);

        &:active,
        &:focus,
        &:hover {
            background-color: var(--button-danger-focus-background-color);
        }
    }

    &.highlight > a {
        background-color: var(--button-highlight-background-color);
        color: var(--button-highlight-color);

        &:active,
        &:focus,
        &:hover {
            background-color: var(--button-highlight-focus-background-color);
        }
    }

    &.icon > a {
        padding: 0;

        > .v-icon {
            height: 100%;
            width: 100%;
        }
    }

    > a {
        align-items: center;
        background-color: var(--button-background-color);
        border-radius: 0.15rem;
        color: var(--button-color);
        cursor: pointer;
        display: flex;
        height: 100%;
        justify-content: center;
        padding: 0 1rem;
        text-decoration: none;
        white-space: nowrap;

        &:active,
        &:focus,
        &:hover {
            background-color: var(--button-focus-background-color);
            outline: none;
        }

        .content {
            flex-grow: 1;
        }

        > .v-icon {
            font-size: 0.9rem;
            min-width: 1.25rem;
            width: 1.25rem;

            & + .content {
                margin-left: 0.5rem;
            }
        }
    }

    & + .v-button {
        margin-left: 0.5rem;
    }

    .v-dropdown {
        display: none;
        min-width: 100%;

        &.active {
            display: unset;
        }
    }
}
</style>
