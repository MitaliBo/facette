export default {
    name: "English",
    date: {
        long: "MMM D YYYY, HH:mm:ss",
    },
    help: {
        refresh: {
            interval: "Refresh interval in seconds. Use “0” to disable.",
        },
        settings: {
            reset: "When resetting, current settings and state will be lost and defaults reapplied.",
        },
        shortcut: {
            filter: "Focus on the filter field",
            fullscreen: "Toggle full screen",
            help: "Open this help dialog",
            refresh: "Open refresh dialog",
            search: "Focus on the search field",
            sidebar: "Toggle sidebar",
            timerange: "Open time range dialog",
        },
    },
    label: {
        admin_panel: {
            _: "Administration panel",
            exit: "Exit administration panel",
        },
        basket: {
            _: "Basket",
            add: "Add to basket",
            refresh: "Refresh basket",
            remove: "Remove from basket",
            save: "Save as collection…",
        },
        browse: "Browse",
        cancel: "Cancel",
        catalog: "Catalog",
        clone: "Clone",
        close: "Close",
        collections: {
            _: "Collections",
            create: "Create collection",
            edit: "Edit collection",
            filter: "Filter collections…",
            name: "Collection name",
            refresh: "Refresh collection",
        },
        columns_count: [
            "{count} column",
            "{count} columns",
        ].join("|"),
        delete: "Delete",
        documentation: "Documentation",
        export: {
            png: "Save PNG…",
            summary_csv: "Export summary as CSV…",
            summary_json: "Export summary as JSON…",
        },
        fullscreen: {
            enter: "Enter full screen",
            exit: "Exit full screen",
        },
        goto: {
            collections: "Go to collection",
            graphs: "Go to graph",
            home: "Go to home page",
            parent: "Go to parent",
        },
        graph: "Graph",
        graphs: {
            _: "Graphs",
            create: "Create graph",
            edit: "Edit graph",
            filter: "Filter graphs…",
            fold: "Fold graph",
            legend: {
                hide: "Hide legend",
                show: "Show legend",
            },
            name: "Graph name",
            refresh: "Refresh graph",
        },
        help: "Help",
        home: "Home",
        info: {
            _: "Information",
            branch: "Branch",
            build_date: "Build date",
            compiler: "Compiler",
            connectors: "Supported connectors",
            revision: "Revision",
            version: "Version",
        },
        keyboard_shortcuts: "Keyboard shortcuts",
        language: {
            _: "Language",
            select: "Select a language…",
        },
        last_modified: "Last modified",
        library: "Library",
        metrics: {
            _: "Metrics",
            filter: "Filter metrics…",
        },
        name: "Name",
        points: {
            loading: "Loading data points…",
            partial: "Partial data",
        },
        providers: {
            _: "Providers",
            create: "Create provider",
            disable: "Disable",
            enable: "Enable",
            filter: "Filter providers…",
            name: "Provider name",
            refresh: "Refresh",
        },
        refresh: {
            automatic: "Automatic refresh",
            interval: "Refresh interval",
        },
        reset: {
            _: "Reset",
            state: "Reset state",
        },
        save: "Save",
        search: "Search…",
        set: "Set",
        set_interval: "Set interval…",
        settings: {
            _: "Settings",
            display: {
                _: "Display",
                alt: "Display settings",
            },
            goto: "Settings…",
            reset: {
                _: "Reset",
                alt: "Reset settings",
            },
        },
        system: "System",
        templates: "Templates",
        theme: {
            _: "Theme",
            select: "Select a theme…",
        },
        timerange: {
            _: "Time range",
            absolute: "Absolute",
            custom: "Custom…",
            end_time: "End time",
            ref_time: "Reference time",
            relative: "Relative",
            reset: "Reset time range",
            select_time: "Select a time…",
            start_time: "Start time",
        },
        total: "Total",
        visit: {
            documentation: "Visit documentation",
            website: "Visit website",
        },
    },
    mesg: {
        action_error: "An error occurred while executing action: {0}",
        bulk_error: "An error occurred while executing bulk action",
        collections: {
            delete: [
                "You are about to delete the “{name}” collection. Are you sure?",
                "You are about to delete {count} collections. Are you sure?",
            ].join("|"),
            none: "No collections defined",
        },
        documentation: "You will find help regarding Facette’s architecture, usage and REST API on the dedicated " +
            "website.",
        error: "Error: {0}",
        fetch_failed: "Failed to fetch data",
        fetch_error: "An error occurred while fetching data: {0}",
        graphs: {
            delete: [
                "You are about to delete the “{name}” graph. Are you sure?",
                "You are about to delete {count} graphs. Are you sure?",
            ].join("|"),
            none: "No graphs defined",
        },
        metrics: {
            none: "No metrics found",
        },
        no_match: "No matches found",
        providers: {
            delete: [
                "You are about to delete the “{name}” provider. Are you sure?",
                "You are about to delete {count} providers. Are you sure?",
            ].join("|"),
            disable: [
                "You are about to disable the “{name}” provider. Are you sure?",
                "You are about to disable {count} providers. Are you sure?",
            ].join("|"),
            disabled: "Provider is disabled",
            enable: [
                "You are about to enable the “{name}” provider. Are you sure?",
                "You are about to enable {count} providers. Are you sure?",
            ].join("|"),
            enabled: "Provider is enabled",
            none: "No providers defined",
        },
        read_only_instance: "Instance is read-only",
        settings: {
            reset: "You are about to reset your settings. Are you sure?",
            saved: "Settings successfully saved",
        },
        templates: {
            instance: "Template instance",
        },
    },
};
