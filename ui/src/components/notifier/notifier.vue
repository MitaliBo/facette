<template>
    <div class="v-notifier" :class="{active: current.text, [type]: true}">
        <v-icon :icon="current.icon" v-if="current.icon"></v-icon>
        <div class="text">{{ current.text }}</div>
        <v-button icon="times" @click="dequeue"></v-button>

        <div class="timer"></div>
    </div>
</template>

<script>
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";

import notifier from ".";

export default {
    name: "v-notifier",
    data() {
        return {
            current: {},
            dequeueDebounce: null,
            queue: [],
            timer: null,
            type: null,
        };
    },
    methods: {
        dequeue() {
            this.current = this.queue.pop() || {};
            if (this.current.type) {
                this.type = this.current.type;
            }

            if (isEmpty(this.current)) {
                return;
            }

            // Re-arm CSS animation
            requestAnimationFrame(() => {
                this.timer.style.display = "none";
                requestAnimationFrame(() => {
                    this.timer.style.display = "unset";
                });
            });

            if (this.dequeueDebounce) {
                this.dequeueDebounce();
            }
        },
        enqueue(text, type = "info", icon = null) {
            if (icon === null) {
                switch (type) {
                case "error":
                    icon = "times-circle";
                    break;

                case "success":
                    icon = "check-circle";
                    break;

                case "warning":
                    icon = "exclamation-circle";
                    break;
                }
            }

            // Re-enqueue current message
            if (!isEmpty(this.current)) {
                this.queue.push(this.current);
            }

            // Remove preexisting message duplicate if found
            let mesg = {text, type, icon},
                idx = this.queue.map(a => Object.values(a).join("\x1e")).indexOf(Object.values(mesg).join("\x1e"));

            if (idx != -1) {
                this.queue.splice(idx, 1);
            }

            this.queue.push(mesg);

            this.dequeue();
        },
    },
    beforeMount() {
        notifier.event.$on("enqueue", this.enqueue);
    },
    mounted() {
        this.timer = this.$el.querySelector(".timer");
        this.dequeueDebounce = debounce(() => this.dequeue(), 6000);
    },
};
</script>

<style lang="scss" scoped>
@keyframes shrink {
    0% {
        width: 100%;
    }

    100% {
        width: 0;
    }
}

.v-notifier {
    align-items: center;
    color: var(--notifier-color);
    display: flex;
    height: 3rem;
    left: 0;
    line-height: 3rem;
    min-height: 3rem;
    padding-left: 1rem;
    position: fixed;
    right: 0;
    top: 0;
    transform: translateY(-100%);
    transition: transform 0.35s ease-in-out;
    z-index: 200;
    will-change: transform;

    &.active {
        transform: translateY(0);
    }

    &.error {
        background-color: var(--notifier-error-background-color);

        /deep/ .v-button > a:active,
        /deep/ .v-button > a:focus,
        /deep/ .v-button > a:hover {
            background-color: var(--notifier-error-highlight-background-color);
        }
    }

    &.success {
        background-color: var(--notifier-success-background-color);

        /deep/ .v-button > a:active,
        /deep/ .v-button > a:focus,
        /deep/ .v-button > a:hover {
            background-color: var(--notifier-success-highlight-background-color);
        }
    }

    &.warning {
        background-color: var(--notifier-warning-background-color);

        /deep/ .v-button > a:active,
        /deep/ .v-button > a:focus,
        /deep/ .v-button > a:hover {
            background-color: var(--notifier-warning-highlight-background-color);
        }
    }

    .text {
        flex-grow: 1;
    }

    .timer {
        animation: shrink 6s linear;
        background-color: var(--notifier-timer-background-color);
        bottom: 0;
        display: block;
        height: 0.25rem;
        left: 0;
        position: absolute;
        transition: width 0;
        width: 100%;
        will-change: width;
    }

    .v-button {
        height: 2.25rem;
        line-height: 2.25rem;
        margin: 0.375rem;

        &.icon {
            width: 2.25rem;
        }

        /deep/ {
            > a {
                color: inherit;
                height: 100%;
            }
        }
    }

    .v-icon {
        font-size: 1.1rem;
        margin-right: 0.75rem;
    }
}
</style>
