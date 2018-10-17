import vue from "vue";
import vuex from "vuex";
import vuexPersistedState from "vuex-persistedstate";

vue.use(vuex);

const props = {
    basket: null,
    collection: null,
    collections: null,
    connectors: [],
    defaults: {},
    graph: null,
    locale: "en",
    readOnly: false,
    sidebar: true,
    state: {},
    theme: "dark",
    title: null,
};

export default new vuex.Store({
    getters: Object.keys(props).reduce((getters, prop) => {
        getters[prop] = getter.bind(null, prop);
        return getters;
    }, {}),
    mutations: Object.keys(props).reduce((mutations, prop) => {
        mutations[prop] = mutation.bind(null, prop);
        return mutations;
    }, {}),
    plugins: [
        vuexPersistedState({
            key: "facette",
            reducer: state => ({
                basket: state.basket,
                locale: state.locale,
                sidebar: state.sidebar,
                state: filterPersist(state.state),
                theme: state.theme,
            }),
        }),
    ],
    state: props,
});

function getter(prop, state) {
    return state[prop];
}

function mutation(prop, state, value) {
    state[prop] = value;
}

function filterPersist(state) {
    return Object.keys(state).reduce((filtered, key) => {
        if (state[key] && state[key].persist) {
            filtered[key] = state[key];
        }
        return filtered;
    }, {});
}
