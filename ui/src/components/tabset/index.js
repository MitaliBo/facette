import vue from "vue";

import tab from "./tab";
import tabset from "./tabset";

[
    tab,
    tabset,
].forEach(component => vue.component(component.name, component));
