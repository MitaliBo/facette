import vue from "vue";

import notifier from "./notifier";

const plugin = {
    install(_vue) {
        this.event = new vue();

        _vue.prototype.$notifier = {
            enqueue(text, type = "info") {
                plugin.event.$emit("enqueue", text, type);
            },
        };

        vue.component(notifier.name, notifier);
    },
};

vue.use(plugin);

export default plugin;
