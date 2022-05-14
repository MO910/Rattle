<template lang="pug">
v-container
    v-row.mt-8
        v-col(cols='3' v-for='folder in folders' :key='folder.title')
            folder(:folder='folder' :translation='true' :router='folderRouter(folder.to)')
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    data: () => ({
        folders: [
            {
                title: "$vuetify.subjects",
                icon: "mdi-bookshelf",
                color: "teal darken-1",
                title_color: "teal--text text--darken-4",
                to: "/courses",
            },
            {
                title: "$vuetify.attend",
                icon: "mdi-calendar-range",
                color: "pink darken-2",
                title_color: "pink--text text--darken-4",
                to: "/attendance",
            },
        ],
    }),
    methods: {
        ...mapActions(["pushRouter"]),
        folderRouter(link) {
            return `${this.$router.currentRoute.path}${link}`;
        },
    },
};
</script>
