<template lang="pug">
v-container
    v-row.mt-8
        .text-h3 {{$vuetify.lang.t('$vuetify.students')}}
        v-btn(color='primary' @click='openUserDialog') add student
        v-btn(color='secondary') import from Excel
        v-btn(color='red' text @click='select=!select') delete
    v-text-field(
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
    )
    v-data-table(
        :headers="headers"
        :items="usersInfo"
        :items-per-page="itemsPerPage"
        :search="search"
        :single-select='false'
        :page.sync="page"
        item-key="id"
        @page-count="pageCount = $event"
        :show-select='select'
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
    addUser(:newUserRule='`${usersMode}s`' :nodePath='usersMode')
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
    async middleware({ store, redirect, route }) {
        const usersMode = route.query?.mode;
        await store.dispatch("getOrganization");
        if (usersMode == "teachers") await store.dispatch("getTeachers");
        else if (usersMode == "students") await store.dispatch("getStudents");
    },
    data: () => ({
        page: 1,
        pageCount: 2,
        itemsPerPage: 10,
        select: false,
        search: "",
        headerNames: ["name", "email", "phone", "group"],
    }),
    computed: {
        ...mapState(["students", "teachers", "organization"]),
        usersInfo() {
            this.usersMode = this.$route.query?.mode;
            const users = this.usersMode.match(/(teachers)|(students)/g)
                ? this[this.usersMode]
                : [];
            console.log(this.usersMode, users);
            return users?.map((s) => {
                let out = { ...s };
                out.group = out.group?.title;
                return out;
            });
        },
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
    methods: {
        ...mapMutations(["updateModel"]),
        openUserDialog() {
            this.updateModel(["addUserForm.dialog", true]);
        },
        nameTranslation(name) {
            // #use graph db
            let litters = {
                اأع: "a",
                ب: "b",
                تط: "t",
                ث: "th",
                جغ: "g",
                هح: "h",
                خ: "kh",
                ذ: "th",
                ر: "r",
                ز: "z",
                صس: "s",
                ش: "sh",
                دظض: "d",
                ف: "f",
                كق: "k",
                ل: "l",
                م: "m",
                ن: "n",
                و: "o",
                ي: "e",
            };
            return name.split("").reduce((acc, l) => {
                acc += Object.entries(litters).filter(([k, v]) =>
                    k.split("").some((x) => x == l)
                )[0][1];
                return acc;
            }, "");
        },
    },
    mounted() {
        console.log(this.nameTranslation("مالك"));
    },
};
</script>
