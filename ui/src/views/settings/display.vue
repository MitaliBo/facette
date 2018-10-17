<template>
    <v-content>
        <v-toolbar></v-toolbar>

        <h1>{{ $t("label.settings.display.alt") }}</h1>

        <v-form>
            <v-label>{{ $t("label.language._") }}</v-label>
            <v-select :options="locales" :placeholder="$t('label.language.select')" v-model="locale"></v-select>

            <v-label>{{ $t("label.theme._") }}</v-label>
            <v-select :options="themes" :placeholder="$t('label.theme.select')" v-model="theme"></v-select>

            <template slot="actions">
                <v-button class="highlight" @click="save">{{ $t("label.save") }}</v-button>
                <v-button @click="reset">{{ $t("label.reset._") }}</v-button>
            </template>
        </v-form>
    </v-content>
</template>

<script>
import themes from "@/components/app/themes";

export default {
    data() {
        return {
            locale: undefined,
            theme: undefined,
        };
    },
    computed: {
        locales() {
            return Object.keys(this.$i18n.messages).sort().map(a => ({label: this.$t("name", a), value: a}));
        },
        themes() {
            return Object.keys(themes).map(a => ({label: themes[a]["name"], value: a}));
        },
    },
    methods: {
        reset() {
            Object.assign(this, {
                locale: this.$store.getters.locale,
                theme: this.$store.getters.theme,
            });
        },
        save() {
            this.$store.commit("locale", this.locale);
            this.$store.commit("theme", this.theme);
            this.$notifier.enqueue(this.$t("mesg.settings.saved", this.locale), "success");
        },
    },
    mounted() {
        this.$title.set(this.$t("label.settings._"));
        this.reset();
    },
};
</script>
