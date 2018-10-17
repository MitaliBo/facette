<template>
    <form class="v-form" novalidate @submit.prevent>
        <div class="title" v-if="title">{{ title }}</div>
        <slot></slot>
        <div class="actions" v-if="hasActions">
            <slot name="actions"></slot>
        </div>
    </form>
</template>

<script>
export default {
    name: "v-form",
    props: {
        title: {
            type: String,
        },
    },
    computed: {
        hasActions() {
            return !!(this.$slots && this.$slots.actions);
        },
    },
};
</script>

<style lang="scss" scoped>
.v-form {
    .actions {
        align-items: center;
        display: flex;
        margin-top: 1.5rem;
    }

    .title {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .v-datetime,
    .v-input {
        width: 100%;

        & + .v-label {
            margin-top: 0.5rem;
        }
    }

    .v-label {
        margin: 0.5rem 0;

        &:first-of-type {
            margin-top: 0;
        }
    }
}
</style>
