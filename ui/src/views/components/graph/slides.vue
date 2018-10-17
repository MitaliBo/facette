<template>
    <div class="v-graph-slides">
        <div class="fold" :class="{active: active.y == 'fold'}" v-if="$route.name.startsWith('browse-')">
            <v-button icon="chevron-up" @click="$parent.exec('toggleFold', true)">
                {{ $t("label.graphs.fold") }}</v-button>
        </div>

        <div class="steps">
            <v-button class="step-backward" icon="arrow-left"
                :class="{active: active.x == 'backward'}" @click="$parent.exec('move', false)"></v-button>
            <v-button class="step-forward" icon="arrow-right"
                :class="{active: active.x == 'forward'}" @click="$parent.exec('move', true)"></v-button>
        </div>

        <div class="legend-toggle" :class="{active: active.y == 'legend'}">
            <v-button icon="chevron-up" @click="$parent.exec('toggleLegend', false)"
                v-if="$parent.state.legend">{{ $t("label.graphs.legend.hide") }}</v-button>
            <v-button icon="chevron-down" @click="$parent.exec('toggleLegend', true)"
                v-else>{{ $t("label.graphs.legend.show") }}</v-button>
        </div>
    </div>
</template>

<script>
const mouseRange = 40;

export default {
    name: "v-graph-slides",
    data() {
        return {
            active: {
                x: null,
                y: null,
            },
        };
    },
    methods: {
        handleMouse(e) {
            let rect = this.$el.getBoundingClientRect(),
                relX = e.pageX - rect.x,
                relY = e.pageY - rect.y;

            if (this.active.x === null) {
                if (relX <= mouseRange) {
                    this.active.x = "backward";
                } else if (relX >= rect.width - mouseRange) {
                    this.active.x = "forward";
                }
            } else if (relX > mouseRange && relX < rect.width - mouseRange) {
                this.active.x = null;
            }

            if (this.active.y === null) {
                if (relY <= mouseRange) {
                    this.active.y = "fold";
                } else if (relY >= rect.height - mouseRange) {
                    this.active.y = "legend";
                }
            } else if (relY > mouseRange && relY < rect.height - mouseRange) {
                this.active.y = null;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.v-graph-slides {
    bottom: 0;
    display: flex;
    flex-direction: column;
    left: 0;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;

    .fold,
    .legend-toggle,
    .step-backward,
    .step-forward {
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
    }

    .fold .v-button,
    .legend-toggle .v-button,
    .step-backward,
    .step-forward {
        pointer-events: auto;

        /deep/ {
            a,
            a:active,
            a:focus,
            a:hover {
                background-color: var(--graph-outline-color);
            }
        }
    }

    .fold,
    .legend-toggle {
        display: flex;

        /deep/ .v-button {
            font-size: 0.75rem;
            line-height: 1.75rem;

            .v-icon {
                font-size: inherit;
                width: auto;
            }
        }
    }

    .fold.active,
    .legend-toggle.active {
        transform: translateY(0);
    }

    .fold {
        transform: translateY(-100%);

        /deep/ a {
            border-radius: 0 0 0.15rem 0;
            padding-left: 0.25rem;
        }
    }

    .legend-toggle {
        justify-content: center;
        transform: translateY(100%);

        /deep/ a {
            border-radius: 0.15rem 0.15rem 0 0;
        }
    }

    .steps {
        align-items: center;
        display: flex;
        flex-grow: 1;
        justify-content: space-between;

        .v-button.icon /deep/ a {
            height: 4rem;
            line-height: 4rem;
            padding: 0 0.5rem;

            .v-icon {
                font-size: 1.5rem;
            }
        }
    }

    .step-backward {
        transform: translateX(-100%);

        /deep/ a {
            border-radius: 0 0.15rem 0.15rem 0;
        }
    }

    .step-forward {
        transform: translateX(100%);

        /deep/ a {
            border-radius: 0.15rem 0 0 0.15rem;
        }
    }

    .step-backward.active,
    .step-forward.active {
        transform: translateX(0);
    }
}
</style>
