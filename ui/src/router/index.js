import vue from "vue";
import vueRouter from "vue-router";
import camelCase from "lodash/camelCase";
import moment from "moment";

import layout from "@/views/layout";
import {adminRoutes} from "@/views/admin";
import {browseRoutes} from "@/views/browse";
import {settingsRoutes} from "@/views/settings";
import {showRoutes} from "@/views/show";
import store from "@/store";
import "@/views/components";

import query from "./query";
import title from "./title";

vue.use(vueRouter);
vue.use(query);
vue.use(title);

const router = new vueRouter({
    linkActiveClass: "active",
    linkExactActiveClass: "active",
    mode: "history",
    routes: [
        {
            name: "root",
            path: "/",
            component: layout,
            children: [].concat(
                adminRoutes,
                browseRoutes,
                settingsRoutes,
                showRoutes,
            ),
            redirect: {
                name: "browse-root",
            },
        },
    ],
    scrollBehavior(to) {
        if (to.hash && to.hash.startsWith("#")) {
            let el = document.getElementById(to.hash.substr(1));
            if (el) {
                el.scrollIntoView();
            }
        }

        return false;
    },
});

router.onReady(() => {
    store.commit("title", document.title);

    // Set locale for Moment.js
    moment.locale(store.getters.locale);

    vue.http({
        method: "OPTIONS",
        url: "/api/v1",
    }).then(response => response.json()).then((response) => {
        Object.keys(response).forEach((key) => {
            store.commit(camelCase(key), response[key]);
        });
    });
});

export default router;
