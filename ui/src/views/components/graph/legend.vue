<template>
    <div class="v-graph-legend">
        <table v-if="$parent.state.legend && chart">
            <tr :class="{disabled: chart.config.series[idx].disabled}" :key="idx" v-for="(series, idx) in data.series">
                <td>
                    <div class="label" @click="selectSeries(idx, $event.shiftKey)" @mousedown.prevent>
                        <span class="color" :style="{backgroundColor: chart.config.series[idx].color}"></span>
                        {{ series.name }}
                    </div>
                </td>
                <th>min</th>
                <td class="value" :class="{active: $parent.state.lines[`${idx}-min`]}"
                        @click="toggleLine(idx, 'min')">
                    <span>{{ chart.config.axes.y.ticks.format(series.summary.min) }}</span>
                </td>
                <th>avg</th>
                <td class="value" :class="{active: $parent.state.lines[`${idx}-avg`]}"
                        @click="toggleLine(idx, 'avg')">
                    <span>{{ chart.config.axes.y.ticks.format(series.summary.avg) }}</span>
                </td>
                <th>max</th>
                <td class="value" :class="{active: $parent.state.lines[`${idx}-max`]}"
                        @click="toggleLine(idx, 'max')">
                    <span>{{ chart.config.axes.y.ticks.format(series.summary.max) }}</span>
                </td>
                <th>last</th>
                <td class="value" :class="{active: $parent.state.lines[`${idx}-last`]}"
                        @click="toggleLine(idx, 'last')">
                    <span>{{ chart.config.axes.y.ticks.format(series.summary.last) }}</span>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: "v-graph-legend",
    computed: {
        chart() {
            return this.$parent.chart;
        },
        data() {
            return this.$parent.data;
        },
    },
    methods: {
        selectSeries(idx, toggle) {
            this.chart.selectSeries(idx, toggle);

            // Apply series selection to parent state
            this.$parent.state = Object.assign(this.$parent.state, {
                series: this.chart.config.series.reduce((indexes, series, seriesIdx) => {
                    indexes[seriesIdx] = !series.disabled;
                    return indexes;
                }, {}),
            });
        },
        toggleLine(idx, key) {
            let id = `${idx}-${key}`,
                lines = this.$parent.state.lines;

            if (this.$parent.state.lines[id]) {
                this.chart.removeLine(id);
                delete lines[id];
            } else {
                this.chart.addLine(id, {
                    label: `${this.data.series[idx].name}/${key}`,
                    y: this.data.series[idx].summary[key],
                    color: document.body.style.getPropertyValue("--graph-line-fill-color"),
                });
                lines[id] = true;
            }

            this.$parent.state = Object.assign(this.$parent.state, {lines: lines});
        },
        update() {
            // Update legend padding based on chart state
            Object.assign(this.$el.style, {
                paddingBottom: `${this.chart.config.margin / 2}px`,
                paddingLeft: `${this.chart.area.left}px`,
                paddingRight: `${this.chart.config.margin}px`,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.v-graph-legend {
    font-size: 0.75rem;
    overflow-x: auto;

    table {
        border-spacing: 0;
    }

    tr.disabled {
        opacity: 0.35;
        pointer-events: none;
    }

    th,
    td {
        padding-right: 0.75rem;
    }

    th {
        color: var(--graph-legend-label-color);
        font-weight: normal;
    }

    td:first-child {
        padding-right: 2rem;
    }

    .label {
        align-items: center;
        cursor: pointer;
        display: flex;
        pointer-events: auto;

        .color {
            border-radius: 0.15rem;
            display: inline-block;
            height: 0.6rem;
            margin-right: 0.5rem;
            width: 0.8rem;
        }
    }

    .value {
        cursor: pointer;

        &.active span {
            background-color: var(--graph-line-fill-color);
            color: var(--app-background-color);
            border-radius: 0.15rem;
        }

        span {
            padding: 0 0.125rem;
        }
    }
}
</style>
