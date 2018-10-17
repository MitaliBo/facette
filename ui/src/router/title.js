import store from "@/store";

export default {
    install(_vue) {
        _vue.mixin({
            beforeCreate() {
                if (this.$title) {
                    return;
                }

                this.$title = {
                    set: (value) => {
                        let title = store.getters.title;
                        if (value) {
                            title = `${value} – ${title}`;
                        }
                        document.title = title;
                    },
                };
            },
        });
    },
};
