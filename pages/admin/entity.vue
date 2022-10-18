<template lang="pug">
v-container
    v-row.mb-8
        v-col.text-h3(cols='12') {{$vuetify.lang.t(`$vuetify.${mode}`)}}
        v-col(cols='12')
            v-btn.mx-2(
                v-if='mode == "users"'
                @click='openAddUserDialog'
                color='primary' icon outlined
            )
                v-icon mdi-plus
            v-btn.mx-2(
                v-else-if='mode == "centers"'
                @click='openCenterDialog'
                color='primary' icon outlined
            )
                v-icon mdi-plus
            v-btn.mx-2(
                @click='openImport'
                color='green' icon outlined
            )
                v-icon mdi-table 
            v-btn.mx-2(
                @click='select=!select'
                color='secondary' icon outlined
            ) 
                v-icon mdi-pencil
        //- searching
        v-col(cols='12' v-if='mode == "users"')
            | Rules:
            v-chip-group(
                v-model='tags'
                active-class='primary--text' column multiple mandatory
            )
                v-chip(v-for='rule in rules' :key='rule' filter) {{ rule }}
        v-col(cols='12')
            v-text-field(
                v-model="search"
                append-icon="mdi-magnify"
                :label="$vuetify.lang.t(`$vuetify.search`)"
                single-line
                hide-details
            )
    //- users cards
    v-row
        v-col.col-md-4.col-sm-6.col-xs-12(v-for='entity in searchResults' :key='entity.id')
            v-card(@click='openEditUserDialog(entity)')
                v-card-title {{fullName(entity)}}
                v-card-text(v-if='mode == "users"') 
                    v-chip.ma-3(v-for='rule in entity.rules' :key='rule.id') {{rule.title}}
                v-card-text(v-else-if='mode == "centers"') {{entity.description}}
        v-col(v-if='!searchResults.length') there is no search results
    //- dialogs
    addUserDialog(v-if='mode == "users"')
    importExcelDialog
    editUserDialog
    addCenter(v-if='mode == "centers"')
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
    async middleware({ store, redirect, route, $auth }) {
        if (!$auth.$state.loggedIn || !$auth.$state.user) redirect("/login");
        const mode = route.query?.mode;
        await store.dispatch("getOrganization");
        if (mode === "users") await store.dispatch("getUsers");
    },
    data() {
        return {
            mode: this.$route.query?.mode,
            page: 1,
            pageCount: 2,
            itemsPerPage: 10,
            select: false,
            search: "",
            tempValue: "",
            newGroupSelectedId: "",
            tags: [],
        };
    },
    mounted() {
        // select all rules
        if (this.mode == "users")
            this.tags = Array.from(
                { length: this.rules.length },
                (_, i) => i * 1
            );
    },
    computed: {
        ...mapState(["organization", "users", "importExcel"]),
        allEntitiesInfo() {
            return this.users?.map((user) => {
                const group = user.groups?.map((g) => g.title)?.join(", ");
                const subgroup = user.subgroups
                    ?.map((g) => g.title)
                    ?.join(", ");
                return { ...user, group, subgroup };
            });
        },
        searchResults() {
            let results;
            if (this.mode == "users") {
                let selectedRules = this.tags?.map((ti) => this.rules[ti]);
                //search by rules
                results = this.allEntitiesInfo.filter((user) =>
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
            } else if (this.mode == "centers")
                results = this.organization.centers.filter((center) =>
                    `${center.title} ${center.description}`.match(this.search)
                );
            return results || [];
        },
        rules() {
            let rules = this.allEntitiesInfo
                .map((u) => u.rules)
                .flat()
                .map((r) => r.title);
            return Array.from(new Set(rules));
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["updateUser"]),
        // open dialogs actions
        openAddUserDialog() {
            this.updateModel(["addUserDialog", true]);
        },
        openEditUserDialog(user) {
            this.updateModel(["editUserForm.dialog", true]);
            this.updateModel(["editUserForm.user", user]);
        },
        openCenterDialog() {
            this.updateModel(["addCenterForm.dialog", true]);
        },
        openImport() {
            this.updateModel(["importExcel.dialog", true]);
        },
        // get full name or title
        fullName(entity) {
            if (this.mode == "users")
                return `${entity.first_name} ${entity.parent_name || ""}`;
            else if (this.mode == "centers") return entity.title;
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
<style lang="sass" scoped>
.v-card
    height: 100%
</style>
