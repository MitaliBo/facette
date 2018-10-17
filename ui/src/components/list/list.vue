<template>
    <table class="v-list">
        <template v-if="hasHeader">
            <thead class="header">
                <tr>
                    <v-list-tile class="select" v-if="selectable && !compact">
                        <v-checkbox @click.native="selectAll(selection.all)" v-model="selection.all"></v-checkbox>
                    </v-list-tile>
                    <slot name="header"></slot>
                </tr>
            </thead>
        </template>
        <tbody>
            <tr class="item" :key="idx" v-for="(item, idx) in value">
                <v-list-tile class="select" v-if="selectable && !compact">
                    <v-checkbox @click.native="selectRange($event, idx)" v-model="selection.items[idx]"></v-checkbox>
                </v-list-tile>
                <slot v-bind="item"></slot>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    name: "v-list",
    props: {
        selectable: {
            type: Boolean,
        },
        value: {
            required: true,
        },
    },
    data() {
        return {
            selection: {
                all: false,
                items: {},
                last: null,
            },
        };
    },
    computed: {
        compact() {
            return this.$mq != "large";
        },
        hasHeader() {
            return !!(this.$slots && this.$slots.header);
        },
    },
    methods: {
        selectAll(state) {
            let selection = {};
            this.value.forEach((_, idx) => { selection[idx] = state; });
            this.selection.items = selection;
        },
        selectRange(e, idx) {
            e.preventDefault();

            if (e.shiftKey && this.selection.last !== null) {
                let items = Object.assign({}, this.selection.items),
                    start = Math.min(this.selection.last, idx),
                    end = Math.max(this.selection.last, idx);

                for (let idx = start; idx <= end; idx++) {
                    items[idx] = this.selection.items[this.selection.last];
                }

                this.selection.items = items;
            }

            this.selection.last = idx;
        },
        updateSelection() {
            let selection = this.value.filter((_, idx) => this.selection.items[idx]);
            this.$emit("selection", selection);
            this.selection.all = selection.length > 0 && selection.length === this.value.length;
        },
    },
    watch: {
        value() {
            this.updateSelection();
        },
        "selection.items": {
            deep: true,
            handler() {
                this.updateSelection();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.v-list {
    border-spacing: 0;
    width: 100%;

    .header .v-list-tile,
    .item .v-list-tile {
        height: 2.25rem;
    }

    .header .v-list-tile {
        color: var(--list-header-color);
        font-size: 0.75rem;
        letter-spacing: 0.05rem;
        text-transform: uppercase;
    }

    .item:hover /deep/ .reveal * {
        opacity: 1;
    }
}
</style>
