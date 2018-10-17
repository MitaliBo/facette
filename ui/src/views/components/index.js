import vue from "vue";

import modalClone from "./modal-clone";
import modalConfirm from "./modal-confirm";
import modalHelp from "./modal-help";
import modalRange from "./modal-range";
import modalRefresh from "./modal-refresh";
import toolbarMain from "./toolbar-main";
import "./graph";

[
    modalClone,
    modalConfirm,
    modalHelp,
    modalRange,
    modalRefresh,
    toolbarMain,
].forEach(component => vue.component(component.name, component));
