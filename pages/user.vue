<template lang="pug">
v-container
    v-col
        .text-h3 {{tempUsers.first_name}}
    v-col.mt-8
        v-data-table(
            :headers="headers"
            :items="tempUsers.goals_history"
            :items-per-page="itemsPerPage"
            :search="search"
            :single-select='false'
            :page.sync="page"
            item-key="id"
            @page-count="pageCount = $event"
            :show-select='select'
            hide-default-footer
            loading-text="Loading... Please wait"
            :loading='true'
            color='red'
            class="elevation-1"
        )
</template>

<script>
import { mapState } from "vuex";
export default {
    // async middleware({ store, redirect, route }) {
    //     await store.dispatch("getOrganization");
    //     await store.dispatch("getStudents");
    // },
    middleware: ["fetchOrganization", "fetchStudents"],
    data: () => ({
        page: 1,
        pageCount: 2,
        itemsPerPage: 10,
        select: false,
        search: "",
        headerNames: ["goal_id", "pint"],
    }),
    mounted() {
        // const id = route.query?.id;
        // const data = await store.dispatch("getUserData", { id });
        // store.commit("updateModel", ["tempUsers", data]);
        console.log(this.tempUsers);
    },
    computed: {
        ...mapState(["tempUsers"]),
        headers() {
            return this.headerNames.reduce((acc, h) => {
                acc.push({
                    text: this.$vuetify.lang.t(`$vuetify.${h}`),
                    value: h,
                });
                return acc;
            }, []);
        },
    },
    methods: {},
};
</script>
