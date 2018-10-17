import graph from "./graph";

export const showRoutes = [
    {
        name: "show-collections",
        path: "/show/collections/:id/:index",
        components: {
            default: graph,
        },
        props: {
            default: route => defineParams(route, {type: "collections"}),
        },
    },
    {
        name: "show-graphs",
        path: "/show/graphs/:id",
        components: {
            default: graph,
        },
        props: route => defineParams(route, {type: "graphs"}),
    },
];

function defineParams(route, params) {
    Object.assign(route.params, params);
}
