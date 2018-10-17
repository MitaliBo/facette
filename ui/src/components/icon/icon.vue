<template>
    <div class="v-icon">
        <font-awesome-icon :icon="icon" v-if="icon"></font-awesome-icon>
        <div class="badge" v-if="badge">{{ badge }}</div>
    </div>
</template>

<script>
import vue from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";

import {
    faArrowAltCircleRight,
    faArrowLeft,
    faArrowRight,
    faArrowsAltV,
    faBars,
    faCalendarAlt,
    faChartArea,
    faCheck,
    faCheckCircle,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faClock,
    faClone,
    faCog,
    faColumns,
    faCompress,
    faDoorOpen,
    faDotCircle,
    faDownload,
    faEllipsisH,
    faEllipsisV,
    faExclamationCircle,
    faExpand,
    faExternalLinkAlt,
    faEyeSlash,
    faFilter,
    faFolder,
    faGlobe,
    faHistory,
    faHome,
    faInfoCircle,
    faLink,
    faPencilAlt,
    faPlay,
    faPlug,
    faPlus,
    faQuestionCircle,
    faSave,
    faSearch,
    faSearchMinus,
    faSearchPlus,
    faShoppingBasket,
    faSlidersH,
    faStop,
    faStopCircle,
    faSync,
    faThLarge,
    faTimes,
    faTimesCircle,
    faTrash,
    faWindowMaximize,
} from "@fortawesome/free-solid-svg-icons";

vue.component(FontAwesomeIcon.name, FontAwesomeIcon);

library.add(
    faArrowAltCircleRight,
    faArrowLeft,
    faArrowRight,
    faArrowsAltV,
    faBars,
    faCalendarAlt,
    faChartArea,
    faCheck,
    faCheckCircle,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faClock,
    faClone,
    faCog,
    faColumns,
    faCompress,
    faDoorOpen,
    faDotCircle,
    faDownload,
    faEllipsisH,
    faEllipsisV,
    faExclamationCircle,
    faExpand,
    faExternalLinkAlt,
    faEyeSlash,
    faFilter,
    faFolder,
    faGlobe,
    faHistory,
    faHome,
    faInfoCircle,
    faLink,
    faPencilAlt,
    faPlay,
    faPlug,
    faPlus,
    faQuestionCircle,
    faSave,
    faSearch,
    faSearchMinus,
    faSearchPlus,
    faShoppingBasket,
    faSlidersH,
    faStop,
    faStopCircle,
    faSync,
    faThLarge,
    faTimes,
    faTimesCircle,
    faTrash,
    faWindowMaximize,
);

export default {
    name: "v-icon",
    props: {
        badge: {
            type: [Number, String],
        },
        icon: {
            type: [Array, String],
        },
    },
};
</script>

<style lang="scss" scoped>
.v-icon {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;

    .badge {
        background-color: var(--icon-badge-background-color);
        border-radius: 1.1rem;
        bottom: 0.25rem;
        color: var(--icon-badge-color);
        line-height: 1.1rem;
        min-height: 1.1rem;
        min-width: 1.1rem;
        padding: 0 0.35rem;
        position: absolute;
        right: 0.2rem;
        transform-origin: bottom right;
        transform: scale(0.7);
    }
}
</style>
