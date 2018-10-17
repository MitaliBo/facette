import vue from "vue";
import vueI18n from "vue-i18n";

import {messages} from "@/locales";

vue.use(vueI18n);

export default new vueI18n({
    locale: "en",
    fallbackLocale: "en",
    messages,
});
