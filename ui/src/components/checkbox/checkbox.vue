<template>
    <div class="v-checkbox" tabindex="0" :class="{checked: value}" @click="toggle()">
        <v-icon :icon="value ? 'check' : ''"></v-icon>
        <input ref="input" type="checkbox" :checked="value" @change="update()">
    </div>
</template>

<script>
export default {
    name: "v-checkbox",
    props: {
        value: {
            required: true,
        },
    },
    methods: {
        toggle() {
            this.$refs.input.checked = !this.$refs.input.checked;
            this.update();
        },
        update() {
            this.$emit("input", this.$refs.input.checked);
        },
    },
};
</script>

<style lang="scss" scoped>
.v-checkbox {
    background-color: var(--input-background-color);
    border: 1px solid var(--input-border-color);
    border-radius: 0.15rem;
    color: var(--input-color);
    cursor: pointer;
    line-height: 1.75rem;
    position: relative;

    &:focus {
        border-color: var(--input-focus-border-color);
        outline: none;
    }

    &.checked {
        background-color: var(--input-focus-border-color);
        border-color: var(--input-focus-border-color);

        .v-icon {
            color: var(--input-background-color);
        }
    }

    .v-icon {
        color: var(--input-icon-color);
        font-size: 0.65rem;
        height: 0.75rem;
        margin: 0;
        width: 0.75rem;
    }

    input[type=checkbox] {
        display: none;
    }
}
</style>
