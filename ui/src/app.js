import vue from "vue";
import vueMQ from "vue-mq";
import vueResource from "vue-resource";
import vueShortkey from "vue-shortkey";
import "element-qsa-scope";
import "fullscreen-api-polyfill";
import "intersection-observer";
import "matchmedia-polyfill";

import i18n from "./i18n";
import router from "./router";
import store from "./store";
import "./components";
import "./events";

vue.use(vueMQ, {breakpoints: {small: 1000, large: Infinity}});
vue.use(vueResource);
vue.use(vueShortkey, {prevent: ["input", "textarea"]});

new vue({
    el: "router-view",
    i18n,
    router,
    store,
});
