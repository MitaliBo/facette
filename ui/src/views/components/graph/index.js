import vue from "vue";

import cursor from "./cursor";
import graph from "./graph";
import legend from "./legend";
import slides from "./slides";
import toolbar from "./toolbar";
import tooltip from "./tooltip";
import zoom from "./zoom";

[
    cursor,
    graph,
    legend,
    slides,
    toolbar,
    tooltip,
    zoom,
].forEach(component => vue.component(component.name, component));

export const
    dateFormatFilename = "YYYYMMDDHHmmss",
    dateFormatRFC3339 = "YYYY-MM-DDTHH:mm:ss.SSSZ";

export const ranges = [
    "1h",
    "3h",
    "1d",
    "3d",
    "7d",
    "1mo",
    "3mo",
    "1y",
];
