export default {
    install(_vue) {
        _vue.mixin({
            beforeCreate() {
                if (this.$params) {
                    return;
                }

                this.$params = {
                    get: (key, fallback) => {
                        let value = this.$route.query[key];
                        return value !== undefined ? value : fallback;
                    },
                    set: (key, value, condition = true) => {
                        let q = Object.assign({}, this.$route.query);

                        if (condition) {
                            q[key] = value;
                        } else {
                            delete q[key];
                        }

                        this.$router.replace({query: q});
                    },
                };
            },
        });
    },
};
