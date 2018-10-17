<template>
    <v-modal name="help">
        <v-form slot-scope="modal" :title="$t('label.help')">
            <v-tabset v-model="section">
                <v-tab value="keyboard" v-if="!touchSupport">{{ $t("label.keyboard_shortcuts") }}</v-tab>
                <v-tab value="documentation">{{ $t("label.documentation") }}</v-tab>
            </v-tabset>

            <table class="list" v-if="section == 'keyboard'">
                <tr :key="idx" v-for="(shortcut, idx) in shortcuts">
                    <td class="shortcut">{{ shortcut.keys.join(" + ") }}</td>
                    <td class="help">{{ $t(String(shortcut.help)) }}</td>
                </tr>
            </table>

            <template v-else>
                <v-message>{{ $t("mesg.documentation") }}</v-message>
                <v-button href="https://docs.facette.io" icon="external-link-alt"
                    target="_blank">{{ $t("label.visit.documentation") }}</v-button>
            </template>

            <template slot="actions">
                <v-button @click="modal.close(null)">{{ $t("label.close") }}</v-button>
            </template>
        </v-form>
    </v-modal>
</template>

<script>
const shortcuts = [
    {keys: ["?"], help: "help.shortcut.help", pattern: null},
    {keys: ["/"], help: "help.shortcut.search", pattern: null},
    {keys: ["f"], help: "help.shortcut.filter", pattern: /^admin-.+-list$/},
    {keys: ["F"], help: "help.shortcut.fullscreen", pattern: null},
    {keys: ["r"], help: "help.shortcut.refresh", pattern: /^(?:browse|show)-/},
    {keys: ["R"], help: "help.shortcut.timerange", pattern: /^(?:browse|show)-/},
    {keys: ["s"], help: "help.shortcut.sidebar", pattern: null},
];

export default {
    name: "v-modal-help",
    data() {
        return {
            section: "keyboard",
        };
    },
    computed: {
        shortcuts() {
            return shortcuts.filter(shortcut => shortcut.pattern === null ||
                this.$route.name.match(shortcut.pattern));
        },
        touchSupport() {
            return "ontouchstart" in document.documentElement;
        },
    },
    mounted() {
        if (this.touchSupport) {
            this.section = "documentation";
        }
    }
};
</script>

<style lang="scss" scoped>
.v-form {
    .list {
        border-spacing: 0.5rem;

        .shortcut {
            background-color: var(--button-focus-background-color);
            border-radius: 0.15rem;
            padding: 0 0.5rem;
            text-align: center;
        }
    }

    .v-message {
        margin-bottom: 1rem;
    }
}
</style>
