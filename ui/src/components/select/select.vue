<template>
    <div class="v-select" :class="{focus: focused}" :tabindex="opened ? -1 : 0" @blur="handleFocus"
            @click="open" @focus="handleFocus" @keydown.enter="open">
        <div class="value" :class="{placeholder: value === undefined}" v-show="!opened">
            <div class="label">{{ value !== undefined ?
                this.options[this.selected].label : placeholder }}</div>
            <v-icon icon="chevron-down"></v-icon>
        </div>

        <v-input type="text" :delay="200" :placeholder="placeholder" @blur="handleFocus" @focus="handleFocus"
            @keydown.native.stop="handleKey" v-model="filter" v-show="opened"></v-input>

        <v-dropdown v-show="opened">
            <v-button :class="{active: idx === active}" :key="idx" @click.stop="select(idx)"
                @mousedown.native.prevent @mouseenter.native="setActive(idx)"
                v-for="(option, idx) in (filteredOptions || options)">{{ option.label }}</v-button>
        </v-dropdown>
    </div>
</template>

<script>
export default {
    name: "v-select",
    props: {
        options: {
            type: Array,
        },
        placeholder: {
            type: String,
        },
        value: {
            required: true,
        },
    },
    data() {
        return {
            active: 0,
            filter: null,
            filteredOptions: null,
            focused: false,
            inputEl: null,
            opened: false,
            selected: 0,
        };
    },
    methods: {
        handleFocus(e) {
            // Skip focus/blur when switching from main element to input
            if (
                e.type == "blur" && e.relatedTarget === this.inputEl ||
                e.type == "focus" && e.relatedTarget === this.$el
            ) {
                return;
            }

            this.focused = e.type == "focus";

            if (!this.focused) {
                this.opened = false;
            }
        },
        handleKey(e) {
            switch (e.which) {
            case 13: // <Enter>
                this.select(this.active);
                this.$el.focus();
                break;

            case 27: // <Escape>
                this.$el.focus();
                break;

            case 38: // <Up>
                e.preventDefault();
                if (this.active > 0) {
                    this.active--;
                }
                break;

            case 40: // <Down>
                e.preventDefault();
                if (this.active < Object.keys(this.filteredOptions || this.options).length - 1) {
                    this.active++;
                }
                break;
            }
        },
        open() {
            let active = this.options.findIndex(a => a.value === this.value);

            this.active = active != -1 ? active : 0;
            this.filter = null;
            this.opened = true;
            this.$nextTick(() => this.inputEl.focus());
        },
        select(idx) {
            this.opened = false;
            this.$emit("input", this.filteredOptions ? this.filteredOptions[idx].value : this.options[idx].value);
            this.$nextTick(() => this.$el.focus());
        },
        setActive(idx) {
            this.active = idx;
        },
    },
    mounted() {
        this.inputEl = this.$el.querySelector("input");
    },
    watch: {
        filter(to) {
            if (to) {
                to = to.toLowerCase();
            }

            this.filteredOptions = to ? this.options.filter(a => a.label.toLowerCase().indexOf(to) != -1) : null;
        },
        value: {
            handler(to) {
                for(let i in this.options) {
                    if (this.options[i].value === to) {
                        this.selected = i;
                    }
                }
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.v-select {
    align-items: center;
    background-color: var(--input-background-color);
    border: 1px solid var(--input-border-color);
    border-radius: 0.15rem;
    color: var(--input-color);
    display: inline-flex;
    line-height: 1.75rem;
    min-width: 12rem;
    padding: 0 0.5rem;
    position: relative;

    &:focus {
        outline: none;
    }

    &.focus {
        border-color: var(--input-focus-border-color);
    }

    .value {
        align-items: center;
        cursor: default;
        display: flex;
        flex-grow: 1;

        &.placeholder .label {
            opacity: 0.35;
        }

        .label {
            flex-grow: 1;
        }

        .v-icon {
            color: var(--input-icon-color);
            font-size: 0.8rem;
            margin-left: 0.5rem;
        }
    }

    .v-dropdown {
        left: 0;
        right: 0;
        top: calc(100% + 1px);
    }

    .v-input {
        background-color: transparent;
        border: none;
        color: inherit;
        min-width: auto;
        padding: 0;
    }
}
</style>
