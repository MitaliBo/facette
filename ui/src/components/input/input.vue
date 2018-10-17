<template>
    <div class="v-input" :class="{completion: hasDropdown && completion.open, focus: focused || completion.open,
            invalid: !checkValidity(), [type]: true}" @click="focus()">
        <v-icon :icon="icon" @mousedown.native.prevent v-if="icon"></v-icon>

        <textarea ref="input" :required="required" :value="value"
            @blur="handleFocus" @focus="handleFocus" @input="update()" v-if="type == 'textarea'"></textarea>

        <input ref="input" :placeholder="placeholder" :required="required" :type="type" :value="value"
            @blur="handleFocus" @focus="handleFocus" @input="update()" @keydown="handleKey"
            v-shortkey.focus="shortkey" v-else>

        <v-icon class="help" icon="question-circle" @mousedown.native.prevent v-tooltip.bottom="help"
            v-if="help"></v-icon>

        <v-dropdown @mousedown.native.prevent v-if="hasDropdown && completion.open">
            <v-label v-if="completion.items.length === 0">{{ $t("mesg.no_match") }}</v-label>
            <slot name="dropdown" v-bind="{focus: dropdownFocus, items: completion.items, select: select}"
                v-else></slot>
        </v-dropdown>
    </div>
</template>

<script>
import debounce from "lodash/debounce";

export default {
    name: "v-input",
    props: {
        autofocus: {
            type: Boolean,
        },
        completionHandler: {
            type: Function,
        },
        icon: {
            type: [Array, String],
        },
        delay: {
            default: 0,
            type: Number,
        },
        help: {
            default: null,
            type: String,
        },
        placeholder: {
            default: "",
            type: String,
        },
        required: {
            type: Boolean,
        },
        shortkey: {
            type: Array,
        },
        type: {
            default: "text",
            type: String,
        },
        value: {
            required: true,
        },
    },
    data() {
        return {
            completion: {
                active: 0,
                items: [],
                open: false,
            },
            focused: false,
        };
    },
    computed: {
        hasDropdown() {
            return !!(this.$scopedSlots && this.$scopedSlots.dropdown);
        },
    },
    methods: {
        checkValidity() {
            return !this.$refs.input || this.$refs.input.checkValidity();
        },
        dropdownFocus(idx, index = false) {
            if (this.completion.activeEl) {
                this.completion.activeEl.classList.remove("active");
            }

            if (index) {
                this.completion.active = idx;
                return;
            }

            let active = this.$el.querySelector(`.v-button:nth-child(${idx + 1})`);
            active.classList.add("active");
            active.scrollIntoView({block: "nearest"});

            Object.assign(this.completion, {
                active: idx,
                activeEl: active,
            });
        },
        focus() {
            if (!this.focused) {
                this.focused = true;
                this.$refs.input.focus();
            }
        },
        handleFocus(e) {
            this.focused = e.type == "focus";
            this.$emit(e.type, e);

            if (this.focused) {
                this.completion.items = [];
            } else {
                this.completion.open = false;
            }
        },
        handleKey(e) {
            switch (e.which) {
            case 13: // <Enter>
                if (this.completion.open) {
                    this.select(this.completion.active);
                }
                break;

            case 27: // <Esc>
                if (this.completionHandler || this.type == "search") {
                    e.preventDefault();

                    if (this.value) {
                        this.completion.open = false;
                        this.$emit("input", null);
                    } else {
                        this.$refs.input.blur();
                    }
                }
                break;

            case 38: // <Up>
            case 40: // <Down>
                if (this.completion.open) {
                    e.preventDefault();

                    if (e.which == 38 && this.completion.active > 0) {
                        this.dropdownFocus(this.completion.active - 1);
                    } else if (e.which == 40 && this.completion.active < this.completion.items.length - 1) {
                        this.dropdownFocus(this.completion.active + 1);
                    }
                }
                break;
            }
        },
        select(idx) {
            this.completion.open = false;

            let link = this.$el.querySelector(`.v-button:nth-child(${idx + 1}) > a[href]`);
            if (link) {
                this.$emit("input", null);
                link.click();
            } else {
                this.update(true);
            }
        },
        update(apply = false) {
            if (apply || this.delay === 0) {
                this.$emit("input", this.$refs.input.value);
            } else {
                this.updateDebounce();
            }
        },
    },
    mounted() {
        if (this.delay > 0) {
            this.updateDebounce = debounce(() => {

                if (this.completionHandler) {
                    if (this.$refs.input.value) {
                        this.completionHandler(this.$refs.input.value).then((response) => {
                            Object.assign(this.completion, {
                                active: 0,
                                items: response,
                                open: true,
                            });

                            this.$nextTick(() => {
                                let active = this.$el.querySelector(".v-button");
                                if (active) {
                                    active.classList.add("active");
                                    this.completion.activeEl = active;
                                }
                            });
                        });
                    } else {
                        Object.assign(this.completion, {
                            active: 0,
                            items: [],
                            open: false,
                        });
                    }
                }

                this.update(true);
            }, this.delay);
        }

        if (this.autofocus) {
            this.$nextTick(() => { this.focus(); });
        }
    },
};
</script>

<style lang="scss" scoped>
.v-input {
    align-items: center;
    background-color: var(--input-background-color);
    border-radius: 0.15rem;
    border: 1px solid var(--input-border-color);
    color: var(--input-color);
    display: inline-flex;
    line-height: 1.75rem;
    min-width: 12rem;
    padding: 0 0.5rem;
    position: relative;

    &.completion {
        border-radius: 0.15rem 0.15rem 0 0;
    }

    &.focus {
        border-color: var(--input-focus-border-color);
    }

    &.invalid {
        border-color: var(--input-invalid-border-color);
        color: var(--input-invalid-color);

        .v-icon.help {
            color: inherit;
        }
    }

    &.textarea {
        padding: 0;
    }

    input,
    textarea {
        background-color: transparent;
        border: none;
        color: inherit;
        flex-grow: 1;
        font: inherit;
        padding: 0;

        &:focus,
        &:invalid {
            box-shadow: none;
            outline: none;
        }
    }

    input[type=number] {
        -moz-appearance: textfield;

        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button, {
            -webkit-appearance: none;
        }
    }

    input[type=search] {
        -webkit-appearance: textfield;

        &::-webkit-search-decoration,
        &::-webkit-search-cancel-button,
        &::-webkit-search-results-button,
        &::-webkit-search-results-decoration {
            display: none;
        }
    }

    textarea {
        padding: 0.5rem;
    }

    .v-dropdown {
        min-width: 100%;
        padding: 1.75rem 0 0;
        top: 0;
        z-index: -1;

        /deep/ {
            .v-button,
            .v-label {
                border-top: 1px solid var(--dropdown-separator-background-color);
                line-height: 2.5rem;
            }

            .v-button {
                height: 2.5rem;

                &:hover,
                &.active,
                &:hover + .v-button,
                &.active + .v-button {
                    border-color: var(--dropdown-focus-border-color);
                }

                &:last-child > a {
                    border-radius: 0 0 0.15rem 0.15rem;
                }
            }

            .v-label {
                color: var(--message-placeholder-color);
                padding: 0 1rem;
            }
        }
    }

    .v-icon {
        color: var(--input-icon-color);
        font-size: 0.9rem;
        margin-right: 0.25rem;
        min-width: 1.25rem;
        width: 1.25rem;

        &.help {
            text-align: right;
            margin-left: 0.5rem;
            margin-right: 0;
            width: auto;
        }
    }
}
</style>
