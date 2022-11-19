<template lang="pug" key="index">
v-container
    v-row(v-if='floatingStudentsExists')
        v-col.text-h3(cols='12') الطلاب
        v-col.col-md-4.col-sm-6.col-xs-12(
            v-for='student in course.floatingStudents'
            v-if='!student.hide'
            :key='student.id'
        )
            custom-card(
                :entity='student'
                :subgroups='subgroups'
                type='floatingStudents'
            )
    v-row.pt-10
        v-col.text-h3(cols='12')
            | المجموعات الفرعية
            v-btn.mx-5(
                @click='openSubgroupDialog'
                color='success' icon outlined
            )
                v-icon mdi-plus
        v-col.col-md-4.col-sm-6.col-xs-12(
            v-for='subgroup in course.subgroups'
            v-if='!subgroup.hide'
            :key='subgroup.id'
        )
            custom-card(
                :entity='subgroup'
                :chips='subgroup.students'
                type='subgroup'
            )
    //- dialog
    add-subgroup-dialog(:course_id='course.id')
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
    // middleware: ["fetchGroups"],
    async fetch({ $auth, store, redirect }) {
        if (!$auth.$state.loggedIn || !$auth.$state.user) redirect("/login");
        else await store.dispatch("getGroups");
    },
    mounted() {},
    data: () => ({}),
    computed: {
        ...mapState(["groups"]),
        group() {
            const { groupId } = this.$route.params;
            const group = this.groups?.find((g) => g.id == groupId);
            return group;
        },
        course() {
            const { courseId } = this.$route.params;
            const group = this.group;
            return group?.courses?.find((s) => s.id == courseId);
        },
        subgroups() {
            return this.course?.subgroups;
        },
        floatingStudentsExists() {
            return this.course?.floatingStudents?.length;
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        openSubgroupDialog() {
            this.updateModel(["addSubgroupForm.dialog", true]);
        },
    },
};
</script>

<style lang="sass">
.items
    padding-bottom: 4em
    border-radius: 10px !important
    box-shadow: 0px 0px 34px -20px rgb(0 0 0 / 50%) !important
    .card-icon > svg
        margin: auto
    .v-card__title
        font-size: clamp(2rem, 3vw, 2.5rem) !important
    &.items
        .v-card__title
            font-size: clamp(2rem, 3vw, 2.5rem) !important
    .v-card__text
        font-size: 1.2rem !important
.folder .folderTitle
    font-size: 1.5em !important
</style>
