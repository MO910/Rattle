<template lang="pug">
v-container
    v-row.mt-8
        .text-h3 {{$vuetify.lang.t('$vuetify.centers')}}
        v-btn(color='primary' @click='openCenterDialog') add center
        v-btn(color='secondary') import from Excel
    |{{this.organization}}
    v-text-field(
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
    )
    v-data-table(
        :headers="headers"
        :items="centers"
        :items-per-page="itemsPerPage"
        :search="search"
        :single-select='false'
        :page.sync="page"
        item-key="id"
        @page-count="pageCount = $event"
        show-select
        hide-default-footer
        loading-text="Loading... Please wait"
        color='red'
        class="elevation-1"
    )
    .text-center
        v-pagination(
            v-model="page"
            :length="pageCount"
        )
    addCenter
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
    middleware: ["fetchOrganization"],
    mounted() {},
    data: () => ({
        page: 1,
        pageCount: 2,
        itemsPerPage: 10,
        search: "",
        headers: [
            { text: "name", value: "name" },
            { text: "Calories", value: "calories" },
        ],
    }),
    computed: {
        ...mapState(["addCenterForm", "organization"]),
        centers() {
            return this.organization?.centers;
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        openCenterDialog() {
            this.updateModel(["addCenterForm.dialog", true]);
        },
    },
};
</script>
