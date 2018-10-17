import display from "./display";
import reset from "./reset";
import sidebar from "./sidebar";
import toolbar from "./toolbar";

export const settingsRoutes = [
    {
        name: "settings-root",
        path: "/settings",
        components: {
            default: display,
            sidebar: sidebar,
            toolbar: toolbar,
        },
    },
    {
        name: "settings-reset",
        path: "/settings/reset",
        components: {
            default: reset,
            sidebar: sidebar,
            toolbar: toolbar,
        },
    },
];
