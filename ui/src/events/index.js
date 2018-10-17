import vue from "vue";

const plugin = {
    install(_vue) {
        _vue.prototype.$events = new vue();
    },
};

vue.use(plugin);

export default plugin;
