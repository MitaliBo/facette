<template>
    <div class="v-paging" v-if="pages > 1">
        <v-button class="entry" icon="chevron-left" :disabled="page == 1" @click="handler(page - 1)"></v-button>
        <v-button class="entry" :class="{highlight: item.value == page}" :disabled="item.value === null"
            :key="idx" @click="handler(item.value)" v-for="(item, idx) in items">{{ item.label }}</v-button>
        <v-button class="entry" icon="chevron-right" :disabled="page == pages" @click="handler(page + 1)"></v-button>
    </div>
</template>

<script>
export default {
    name: "v-paging",
    props: {
        adjacency: {
            default: 2,
            type: Number,
        },
        handler: {
            required: true,
            type: Function,
        },
        page: {
            required: true,
            type: Number,
        },
        pageSize: {
            required: true,
            type: Number,
        },
        total: {
            required: true,
            type: Number,
        },
    },
    data() {
        return {
            items: [],
            pages: 0,
        };
    },
    methods: {
        addEllipsis(items) {
            items.push({label: "…", value: null});
        },
        addRange(items, start, end) {
            for (let i = start; i <= end; i++) {
                items.push({label: String(i), value: i});
            }
        },
        update() {
            let items = [],
                fullAdjacency = this.adjacency * 2;

            this.pages = Math.ceil(this.total / this.pageSize);

            if (this.pages <= fullAdjacency * 2) {
                this.addRange(items, 1, this.pages);
            }

            // Paging is at the beginning
            else if (this.page <= fullAdjacency) {
                let end = fullAdjacency + this.adjacency + 1;

                this.addRange(items, 1, end);
                if (end != this.pages - this.adjacency - 1) {
                    this.addEllipsis(items);
                }
                this.addRange(items, this.pages - this.adjacency, this.pages);
            }

            // Paging is in the middle
            else if (this.page < this.pages - fullAdjacency) {
                let start = this.page - this.adjacency,
                    end = this.page + this.adjacency,
                    startDelta = 0,
                    endDelta = 1;

                if (this.page == this.pages - fullAdjacency) {
                    startDelta = 1;
                }

                if (this.page == fullAdjacency + 1) {
                    endDelta = 0;
                }

                this.addRange(items, 1, this.adjacency + startDelta);
                if (endDelta !== 0) {
                    this.addEllipsis(items);
                }
                this.addRange(items, start, end);
                if (startDelta === 0 && this.page != this.pages / 2) {
                    this.addEllipsis(items);
                }
                this.addRange(items, this.pages - this.adjacency + endDelta, this.pages);
            }

            // Paging is at the end
            else {
                let start = this.pages - (fullAdjacency + this.adjacency),
                    end = this.pages;

                this.addRange(items, 1, this.adjacency + 1);
                if (start != this.adjacency + 2) {
                    this.addEllipsis(items);
                }
                this.addRange(items, start, end);
            }

            this.items = items;
        },
    },
    watch: {
        page: {
            handler() {
                this.update();
            },
            immediate: true,
        },
        total() {
            this.update();
        },
    },
};
</script>

<style lang="scss" scoped>
.v-paging {
    display: flex;
    justify-content: center;
    margin: 2rem 0;

    .v-button {
        height: 1.75rem;
        line-height: 1.75rem;
        min-width: 1.75rem;
        text-align: center;

        /deep/ a {
            padding: 0;
        }
    }
}
</style>
