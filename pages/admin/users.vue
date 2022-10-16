<template lang="pug">
v-container
    v-row.mt-8
        .text-h3 {{$vuetify.lang.t(`$vuetify.${usersMode}`)}}
        v-btn(color='primary' @click='openUserDialog') {{$vuetify.lang.t(`$vuetify.add_${newUserRule}`)}}
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
        item-key="id"
        :items-per-page="itemsPerPage"
        :search="search"
        :single-select='false'
        :page.sync="page"
        @page-count="pageCount = $event"
        :show-select='select'
        hide-default-footer
        loading-text="Loading... Please wait"
        color='red'
        class="elevation-1"
    )
        template(v-slot:item.first_name='props')
            edit-dialog(:props='props' col='first_name')
        template(v-slot:item.parent_name='props')
            edit-dialog(:props='props' col='parent_name')
        template(v-slot:item.phone='props')
            edit-dialog(:props='props' col='phone')
        template(v-slot:item.email='props')
            edit-dialog(:props='props' col='email')
        template(v-slot:item.group='props')
            //- @save="save"
            //- @cancel="cancel"
            //- @open="open"
            //- @close="close"
            v-edit-dialog(
                :return-value.sync='props.item.group'
                @open="open(props)"
                @close='close(props)'
            ) {{ props.item.group }}
                template(v-slot:input)
                    v-select(
                        v-model="newGroupSelectedId"
                        :items="organization.groups"
                        item-text='title'
                        item-value='id'
                        label="group"
                    )

    .text-center
        v-pagination(
            v-model="page"
            :length="pageCount"
        )
    addUser(:newUserRule='newUserRule' :nodePath='usersMode')
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
    async middleware({ store, redirect, route, $auth }) {
        if (!$auth.$state.loggedIn || !$auth.$state.user) redirect("/login");
        const usersMode = route.query?.mode;
        await store.dispatch("getOrganization");
        // console.log(store.state.organization);
        if (usersMode == "teachers") await store.dispatch("getTeachers");
        else if (usersMode == "students") await store.dispatch("getStudents");
    },
    data() {
        return {
            usersMode: this.$route.query?.mode,
            page: 1,
            pageCount: 2,
            itemsPerPage: 10,
            select: false,
            search: "",
            tempValue: "",
            newGroupSelectedId: "",
            headerNames: [
                "first_name",
                "parent_name",
                "email",
                "phone",
                "group",
                "subgroup",
            ],
        };
    },
    mounted() {
        // console.log(this.nameTranslation("مالك"));
    },
    computed: {
        ...mapState(["students", "teachers", "organization"]),
        usersInfo() {
            const users = this.usersMode.match(/(teachers)|(students)/g)
                ? this[this.usersMode]
                : [];
            // console.log(users);
            return users?.map((user) => {
                const group = user.groups?.map((g) => g.title)?.join(", ");
                const subgroup = user.subgroups
                    ?.map((g) => g.title)
                    ?.join(", ");
                return { ...user, group, subgroup };
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
        newUserRule() {
            return this.usersMode.replace(/s$/, "");
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["updateUser"]),
        openUserDialog() {
            this.updateModel(["addUserForm.dialog", true]);
        },
        open(props) {
            this.newGroupSelectedId = props.item.group.id;
            console.log(props.header.value);
        },
        close(props) {
            console.log(props, this.newGroupSelectedId);
        },
        // nameTranslation(name) {
        //     // #use graph db
        //     let litters = {
        //         اأع: "a",
        //         ب: "b",
        //         تط: "t",
        //         ث: "th",
        //         جغ: "g",
        //         هح: "h",
        //         خ: "kh",
        //         ذ: "th",
        //         ر: "r",
        //         ز: "z",
        //         صس: "s",
        //         ش: "sh",
        //         دظض: "d",
        //         ف: "f",
        //         كق: "k",
        //         ل: "l",
        //         م: "m",
        //         ن: "n",
        //         و: "o",
        //         ي: "e",
        //     };
        //     return name.split("").reduce((acc, l) => {
        //         acc += Object.entries(litters).filter(([k, v]) =>
        //             k.split("").some((x) => x == l)
        //         )[0][1];
        //         return acc;
        //     }, "");
        // },
    },
};
</script>
