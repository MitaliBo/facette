export default {
    name: "Français",
    date: {
        long: "D MMM YYYY, HH:mm:ss",
    },
    help: {
        refresh: {
            interval: "Intervalle de rafraîchissement en secondes. Utiliser « 0 » pour désactiver.",
        },
        settings: {
            reset: "En réinitialisant, vos paramètres et état courants seront perdus et ceux par défaut réappliqués.",
        },
        shortcut: {
            filter: "Sélectionner le champ de filtre",
            fullscreen: "Activer/Désactiver le plein écran",
            help: "Ouvrir cette fenêtre d’aide",
            refresh: "Ouvrir la fenêtre de rafraîchissement",
            search: "Sélectionner le champ de recherche",
            sidebar: "Activer/Désactiver la barre latérale",
            timerange: "Ouvrir la fenêtre de plage de temps",
        },
    },
    label: {
        admin_panel: {
            _: "Panneau d’administration",
            exit: "Quitter le panneau d’administration",
        },
        basket: {
            _: "Panier",
            add: "Ajouter au panier",
            refresh: "Rafraîchir le panier",
            remove: "Supprimer du panier",
            save: "Sauvegarder en tant que collection…",
        },
        browse: "Parcourir",
        cancel: "Annuler",
        catalog: "Catalogue",
        clone: "Cloner",
        close: "Fermer",
        collections: {
            _: "Collections",
            create: "Créer une collection",
            edit: "Éditer la collection",
            filter: "Filtrer les collections…",
            name: "Nom de la collection",
            refresh: "Rafraîchir la collection",
        },
        columns_count: [
            "{count} colonne",
            "{count} colonnes",
        ].join("|"),
        delete: "Supprimer",
        documentation: "Documentation",
        export: {
            png: "Sauvegarder le PNG…",
            summary_csv: "Exporter le résumé en CSV…",
            summary_json: "Exporter le résumé en JSON…",
        },
        fullscreen: {
            enter: "Plein écran",
            exit: "Quitter le plein écran",
        },
        goto: {
            collections: "Aller à la collection",
            graphs: "Aller au graphique",
            home: "Aller à la page d’accueil",
            parent: "Aller au parent",
        },
        graph: "Graphique",
        graphs: {
            _: "Graphiques",
            create: "Créer un graphique",
            edit: "Éditer le graphique",
            filter: "Filtrer les graphiques…",
            fold: "Replier le graphique",
            legend: {
                hide: "Masquer la légende",
                show: "Afficher la légende",
            },
            name: "Nom du graphique",
            refresh: "Rafraîchir le graphique",
        },
        help: "Aide",
        home: "Accueil",
        info: {
            _: "Informations",
            branch: "Branche",
            build_date: "Date de compilation",
            compiler: "Compilateur",
            connectors: "Connecteurs supportés",
            revision: "Révision",
            version: "Version",
        },
        keyboard_shortcuts: "Raccourcis clavier",
        language: {
            _: "Langue",
            select: "Sélectionnez une langue…",
        },
        last_modified: "Dernière modification",
        library: "Librairie",
        metrics: {
            _: "Métriques",
            filter: "Filtrer les métriques…",
        },
        name: "Nom",
        points: {
            loading: "Loading data points…",
            partial: "Partial data",
        },
        providers: {
            _: "Fournisseurs",
            create: "Créer un fournisseur",
            disable: "Désactiver",
            enable: "Activer",
            filter: "Filtrer les fournisseurs…",
            name: "Nom du fournisseur",
            refresh: "Rafraîchir",
        },
        refresh: {
            automatic: "Rafraîchissement automatique",
            interval: "Intervalle de rafraîchissement",
        },
        reset: {
            _: "Réinitialiser",
            state: "Réinitialiser l’état",
        },
        save: "Sauvegarder",
        search: "Rechercher…",
        set: "Définir",
        set_interval: "Définir l’intervalle…",
        settings: {
            _: "Préférences",
            display: {
                _: "Affichage",
                alt: "Préférences d’affichage",
            },
            goto: "Préférences…",
            reset: {
                _: "Réinitialiser",
                alt: "Réinitialisation des préférences",
            },
        },
        system: "Système",
        templates: "Modèles",
        theme: {
            _: "Thème",
            select: "Sélectionnez un thème…",
        },
        timerange: {
            _: "Plage de temps",
            absolute: "Absolue",
            custom: "Personnalisée…",
            end_time: "Heure de fin",
            ref_time: "Heure de référence",
            relative: "Relative",
            reset: "Réinitialiser la plage",
            select_time: "Sélectionnez une heure…",
            start_time: "Heure de début",
        },
        total: "Total",
        visit: {
            documentation: "Visiter la documentation",
            website: "Visiter le site web",
        },
    },
    mesg: {
        action_error: "Une erreur est survenue lors de l’exécution de l’action : {0}",
        bulk_error: "Une erreur est survenue lors de l’exécution des actions",
        collections: {
            delete: [
                "Vous êtes sur le point de supprimer la collection « {name} ». Voulez-vous continuer ?",
                "Vous êtes sur le point de supprimer {count} collections. Voulez-vous continuer ?",
            ].join("|"),
        },
        documentation: "Vous retrouverez de l’aide sur l’architecture de Facette, son utilisation et son API REST " +
            "en visitant le site web dédié.",
        error: "Erreur : {0}",
        fetch_failed: "Impossible de récupérer les données",
        fetch_error: "Une erreur est survenue lors de la récupération des données : {0}",
        graphs: {
            delete: [
                "Vous êtes sur le point de supprimer le graphique « {name} ». Voulez-vous continuer ?",
                "Vous êtes sur le point de supprimer {count} graphiques. Voulez-vous continuer ?",
            ].join("|"),
            none: "Aucun graphique défini",
        },
        no_match: "Aucune correspondance trouvée",
        providers: {
            delete: [
                "Vous êtes sur le point de supprimer le fournisseur « {name} ». Voulez-vous continuer ?",
                "Vous êtes sur le point de supprimer {count} fournisseurs. Voulez-vous continuer ?",
            ].join("|"),
            disable: [
                "Vous êtes sur le point de désactiver le fournisseur « {name} ». Voulez-vous continuer ?",
                "Vous êtes sur le point de désactiver {count} fournisseurs. Voulez-vous continuer ?",
            ].join("|"),
            disabled: "Ce fournisseur est inactif",
            enable: [
                "Vous êtes sur le point d’activer le fournisseur « {name} ». Voulez-vous continuer ?",
                "Vous êtes sur le point d’activer {count} fournisseurs. Voulez-vous continuer ?",
            ].join("|"),
            enabled: "Ce fournisseur est actif",
        },
        read_only_instance: "Instance en lecture seule",
        settings: {
            reset: "Vous êtes sur le point de réinitialiser vos préférences. Voulez-vous continuer ?",
            saved: "Préférences sauvegardées avec succès",
        },
        templates: {
            instance: "Instance de modèle",
        },
    },
};
