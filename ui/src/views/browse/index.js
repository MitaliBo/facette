import collection from "./collection";
import home from "./home";
import sidebar from "./sidebar";
import toolbar from "./toolbar";

export const browseRoutes = [
    {
        name: "browse-root",
        path: "/browse",
        components: {
            default: home,
            sidebar: sidebar,
            toolbar: toolbar,
        },
    },
    {
        name: "browse-basket",
        path: "/browse/basket",
        components: {
            default: collection,
            sidebar: sidebar,
            toolbar: toolbar,
        },
        props: {
            default: route => defineParams(route, {id: null, type: "basket"}),
        },
    },
    {
        name: "browse-collections",
        path: "/browse/collections/:id",
        components: {
            default: collection,
            sidebar: sidebar,
            toolbar: toolbar,
        },
        props: {
            default: route => defineParams(route, {type: "collections"}),
        },
    },
    {
        name: "browse-graphs",
        path: "/browse/graphs/:id",
        components: {
            default: collection,
            sidebar: sidebar,
            toolbar: toolbar,
        },
        props: {
            default: route => defineParams(route, {type: "graphs"}),
        },
    },
];

function defineParams(route, params) {
    Object.assign(route.params, params);
}
