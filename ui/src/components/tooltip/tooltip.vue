<script>
import vue from "vue";
import vueTooltip from "v-tooltip";

vue.use(vueTooltip, {
    defaultClass: "v-tooltip",
});

export default {};
</script>

<style lang="scss">
.v-tooltip {
    background-color: var(--tooltip-background-color);
    border-radius: 0.15rem;
    color: var(--tooltip-color);
    font-size: 0.8rem;
    line-height: 1.5rem;
    max-width: 30%;
    padding: 0.25rem 0.75rem;
    pointer-events: none;
    position: absolute;
    z-index: 250;

    &::before {
        border: 0.5rem solid transparent;
        content: "";
        height: 0;
        position: absolute;
        width: 0;
    }

    &[x-placement^="bottom"]::before {
        border-bottom-color: var(--tooltip-background-color);
        bottom: 100%;
        left: 50%;
        transform: translateX(-0.5rem);
    }
}
</style>
