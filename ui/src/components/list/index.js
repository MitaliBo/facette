import vue from "vue";

import list from "./list";
import tile from "./tile";

[
    list,
    tile,
].forEach(component => vue.component(component.name, component));
