<template lang="pug">
v-container
    v-row.mt-8
        .text-h3 {{$vuetify.lang.t(`$vuetify.users`)}}
        v-btn(color='primary' @click='openAddUserDialog') {{$vuetify.lang.t(`$vuetify.addUser`)}}
        v-btn(color='green' @click='openImport') import from Excel
        v-btn(color='red' text @click='select=!select') delete
    //- searching
    v-chip-group.mt-10(
        v-model='tags'
        active-class='primary--text' column multiple
    )
        v-chip(v-for='rule in rules' :key='rule' filter) {{ rule }}
    v-text-field(
        v-model="search"
        append-icon="mdi-magnify"
        :label="$vuetify.lang.t(`$vuetify.search`)"
        single-line
        hide-details
    )
    //- users cards
    v-row
        v-col.mt-10.col-md-4.col-sm-6.col-xs-12(v-for='user in searchResults' :key='user.id')
            v-card(@click='openEditUserDialog(user)')
                v-card-title {{fullName(user)}}
                v-card-text 
                    v-chip.ma-3(v-for='rule in user.rules' :key='rule.id') {{rule.title}}
        v-col.mt-10(v-if='!searchResults.length') there is no search results
    addUserDialog
    importExcelDialog
    editUserDialog
    //- div
        v-data-table(
            :headers="headers"
            :items="allUsersInfo"
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
    //- .text-center
        v-pagination(
            v-model="page"
            :length="pageCount"
        )
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
    async middleware({ store, redirect, route, $auth }) {
        if (!$auth.$state.loggedIn || !$auth.$state.user) redirect("/login");
        // const usersMode = route.query?.mode;
        await store.dispatch("getOrganization");
        // console.log(store.state.organization);
        await store.dispatch("getUsers");
    },
    data() {
        return {
            // usersMode: this.$route.query?.mode,
            page: 1,
            pageCount: 2,
            itemsPerPage: 10,
            select: false,
            search: "",
            tempValue: "",
            newGroupSelectedId: "",
            tags: [],
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
        // select all rules
        this.tags = Array.from({ length: this.rules.length }, (_, i) => i * 1);
    },
    computed: {
        ...mapState(["users", "organization", "importExcel"]),
        allUsersInfo() {
            return this.users?.map((user) => {
                const group = user.groups?.map((g) => g.title)?.join(", ");
                const subgroup = user.subgroups
                    ?.map((g) => g.title)
                    ?.join(", ");
                return { ...user, group, subgroup };
            });
        },
        searchResults() {
            let selectedRules = this.tags?.map((ti) => this.rules[ti]),
                //search by rules
                results = this.allUsersInfo.filter((user) =>
                    user.rules.some(
                        (rule) => selectedRules?.indexOf(rule.title) !== -1
                    )
                );
            // search by name
            results = results.filter((user) =>
                this.fullName(user).match(this.search)
            );
            // sort by name
            results.sort((x, y) =>
                this.fullName(x).localeCompare(this.fullName(y))
            );
            return results;
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
        rules() {
            let rules = this.allUsersInfo
                .map((u) => u.rules)
                .flat()
                .map((r) => r.title);
            return Array.from(new Set(rules));
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["updateUser"]),
        openAddUserDialog() {
            this.updateModel(["addUserDialog", true]);
        },
        openEditUserDialog(user) {
            this.updateModel(["editUserForm.dialog", true]);
            this.updateModel(["editUserForm.user", user]);
        },
        openImport() {
            this.updateModel(["importExcel.dialog", true]);
        },
        fullName(user) {
            return `${user.first_name} ${user.parent_name || ""}`;
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
