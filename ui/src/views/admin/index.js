import info from "./info";
import list from "./list";
import sidebar from "./sidebar";
import toolbar from "./toolbar";

export const adminRoutes = [
    {
        name: "admin-root",
        path: "/admin",
        redirect: {
            name: "admin-collections-list",
        },
    },
    {
        name: "admin-info",
        path: "/admin/info",
        components: {
            default: info,
            sidebar: sidebar,
            toolbar: toolbar,
        },
    },
    {
        name: "admin-collections-list",
        path: "/admin/collections",
        components: {
            default: list,
            sidebar: sidebar,
            toolbar: toolbar,
        },
        props: {
            default: route => defineParams(route, {section: "library", type: "collections"}),
        },
    },
    {
        name: "admin-graphs-list",
        path: "/admin/graphs",
        components: {
            default: list,
            sidebar: sidebar,
            toolbar: toolbar,
        },
        props: {
            default: route => defineParams(route, {section: "library", type: "graphs"}),
        },
    },
    {
        name: "admin-metrics-list",
        path: "/admin/metrics",
        components: {
            default: list,
            sidebar: sidebar,
            toolbar: toolbar,
        },
        props: {
            default: route => defineParams(route, {section: "catalog", type: "metrics"}),
        },
    },
    {
        name: "admin-providers-list",
        path: "/admin/providers",
        components: {
            default: list,
            sidebar: sidebar,
            toolbar: toolbar,
        },
        props: {
            default: route => defineParams(route, {section: "system", type: "providers"}),
        },
    },
];

function defineParams(route, params) {
    Object.assign(route.params, params);
}
