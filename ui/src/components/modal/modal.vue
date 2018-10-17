<template>
    <div class="v-modal" :name="name" @click="close(false)" @keydown.enter="validate" @keydown.esc="close(false)"
            @keydown.tab="handleFocus" v-if="visible">
        <div class="content" @click.stop>
            <slot v-bind="{close, focus}"></slot>
        </div>
    </div>
</template>

<script>
import modal from ".";

export default {
    name: "v-modal",
    props: {
        name: {
            required: true,
            type: String,
        },
    },
    data() {
        return {
            handler: null,
            shiftKey: false,
            visible: false,
        };
    },
    methods: {
        close(data = null) {
            if (data && this.handler) {
                this.handler(data);
            }

            this.toggle(this.name, false);
        },
        focus() {
            let input = this.$el.querySelector(".v-input input, .v-input textarea");

            if (input) {
                input.focus();
                input.select();
            } else {
                this.$el.querySelector(".v-button.danger a, .v-button.highlight a, .v-button a").focus();
            }
        },
        handleFocus(e) {
            let focusable = this.$el.querySelectorAll("[tabindex]:not([tabindex=\"-1\"])"),
                idx = null;

            if (!e.shiftKey && e.target === focusable[focusable.length - 1]) {
                idx = 0;
            } else if (e.shiftKey && e.target === focusable[0]) {
                idx = focusable.length - 1;
            }

            if (idx !== null) {
                e.preventDefault();
                this.$nextTick(() => { focusable[idx].focus(); });
            }
        },
        toggle(name, state, handler) {
            if (name !== this.name) {
                return;
            }

            // TODO: hide previously existing overlay?
            this.handler = handler;
            this.visible = state;

            if (state) {
                this.$nextTick(() => { this.focus(); });
            }
        },
        validate() {
            this.$el.querySelector(".v-button:last-of-type a").click();
        },
    },
    beforeMount() {
        modal.event.$on("toggle", this.toggle);
    },
    beforeDestroy() {
        modal.event.$off("toggle", this.toggle);
    },
};
</script>

<style lang="scss" scoped>
.v-modal {
    align-items: center;
    background-color: var(--modal-background-color);
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 500;

    .content {
        background-color: var(--app-background-color);
        border-radius: 0.15rem;
        box-shadow: 0 0.15rem 1rem var(--modal-content-box-shadow-color);
        min-width: 22rem;
        max-width: 35vw;
        padding: 1.5rem;
    }

    /deep/ .v-form .actions {
        justify-content: flex-end;
    }
}
</style>
