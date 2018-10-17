import vue from "vue";

import modal from "./modal";

const plugin = {
    install(_vue) {
        this.event = new vue();

        _vue.prototype.$modal = {
            hide(name) {
                plugin.event.$emit("toggle", name, false);
            },
            show(name, handler) {
                plugin.event.$emit("toggle", name, true, handler);
            },
        };

        vue.component(modal.name, modal);
    },
};

vue.use(plugin);

export default plugin;
