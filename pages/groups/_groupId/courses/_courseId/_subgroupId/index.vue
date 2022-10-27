<template lang="pug" key="index">
v-container 
    v-row
        v-col.text-h3(cols='12') {{ subgroup.title || fullName(subgroup)}}
        date-picker(
            :historyAction='getSubgroupHistoryAtDate'
            :historyParams='historyParams'
            :allowedDates='allowedDates'
        )
    //- plans
    v-row.mt-10
        v-col
            v-btn(
                nuxt :to='calendarRouter'
                color='primary lighten-2'
                outlined block x-large
            )
                v-icon.mx-5 mdi-calendar-today
                | {{$vuetify.lang.t('$vuetify.showCalendar')}}
        v-col.text-h4(cols='12')
            p.d-inline-block {{$vuetify.lang.t('$vuetify.plans')}}
            addPlan(
                :default_days='groupWorkingDays'
                :group_id='group.id'
                :subgroup_id='subgroup.id'
                :after='fetchPlansDate'
                :isStudent='isStudent'
            )
    v-row.mt-10(v-if='plansOfDate.length')
        v-col.px-0.text-h4.col-md-4.col-sm-6.col-xs-12(
            v-for='(plan, pi) in plansOfDate'
            :key='plan.id'
            v-if='!plan.hide'
        )
            v-card.mx-5(:color='plan.color')
                v-btn(@click='deletePlan(plan.id)' icon)
                    v-icon mdi-delete
                v-card-title.d-block.text-center {{$vuetify.lang.t(`$vuetify.${plan.title}`)}}
                v-card-text {{getPlanString(plan, false)}}
    v-row(v-else)
        v-col.text-h5(cols='12') there is no plans. do you want to add one!
    //- student
    v-row.mt-10(v-if='subgroup.students')
        v-col.text-h4(cols='12') {{$vuetify.lang.t('$vuetify.students')}}
        v-col.px-0.col-xs-12.col-sm-12.col-md-6(
            cols='6'
            v-for='student, i in subgroup.students'
            :key='i'
        )
            custom-card.mx-5(
                :entity='student'
                :subgroups='course.subgroups'
                :advantage='plansOfDate'
                :selectedDate='datePicker.selectedDate'
                :notRouter='true'
                :loading="datePicker.fetching"
                type='subgroup'
            )
    v-row.mt-10(v-else)
        v-col.px-0(
            cols='12'
            v-if='dayExist'
        )
            v-card.mx-5(:loading="datePicker.fetching")
                template(slot="progress")
                    v-progress-linear(indeterminate)
                div.py-5.px-10
                    //- v-card-title.text-capitalize.text-h4.pt-6 {{fullName(subgroup)}}
                    advantage(
                        v-for='plan, pi in plansOfDate'
                        :key='pi'
                        v-if='plan.day && !datePicker.fetching && !plan.hide'
                        :plan='plan'
                        :student_id='subgroup.id'
                        :selectedDate='datePicker.selectedDate'
                        :divider='advantageDivider(pi)'
                    )
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { planTable } from "~/static/js/planTable";
import { stringify } from "~/static/js/stringify";
import { DAY_MILL_SEC, getDefInDays } from "~/static/js/generatePlanDays";
import { extractISODate } from "~/static/js/extractISODate";
export default {
    // middleware: ["fetchGroups"],
    async fetch({ $auth, store, redirect }) {
        if (!$auth.$state.loggedIn || !$auth.$state.user) redirect("/login");
        else await store.dispatch("getGroups");
    },
    data: () => ({
        margePlans: [],
        tableIndex: null,
        tableDialog: false,
        isStudent: false,
    }),
    async mounted() {
        await this.fetchPlansDate();
    },
    computed: {
        ...mapState([
            "groups",
            "surahAdj",
            "versesPerPage",
            "selectedDateHistory",
            "plansToTables",
            "plans",
            "datePicker",
        ]),
        // get the Group
        group() {
            const { groupId } = this.$route.params;
            return this.groups.filter((g) => g.id == groupId)?.[0];
        },
        // get the Course
        course() {
            const { courseId } = this.$route.params;
            if (this.group)
                return this.group.courses.filter((c) => c.id == courseId)?.[0];
        },
        // get the Subgroup
        subgroup() {
            const { subgroupId } = this.$route.params,
                sub = this.course.subgroups.filter(
                    (s) => s.id == subgroupId
                )?.[0],
                student =
                    sub ||
                    this.course.floatingStudents.filter(
                        (s) => s.id == subgroupId
                    )?.[0];
            this.isStudent = !sub;
            return sub || student;
        },
        // week days name in the current language
        weekDays() {
            let weekDays = JSON.parse(this.$vuetify.lang.locales.en.weekDays);
            return this.group.working_days.map((di) => weekDays[di]);
        },
        groupWorkingDays() {
            return this.group?.working_days;
        },
        // get plans of the selected date
        plansOfDate() {
            return this.plans.map((p) => {
                let pClone = { ...p };
                pClone.day = pClone.days.filter(
                    (d) =>
                        extractISODate({ date: d.date }) ==
                        this.datePicker.selectedDate
                )?.[0];
                delete pClone.days;
                return pClone;
            });
        },
        // check if day in plans exists
        dayExist() {
            return this.plansOfDate?.some((p) => p.day);
        },
        // rout to calendar
        calendarRouter() {
            return `${this.$router.currentRoute.path}/calendar`;
        },
        // for date picker
        historyParams() {
            return { subgroup_id: this.subgroup.id };
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["getSubgroupHistoryAtDate", "removePlan"]),
        // get the start day of the closest week
        getClosestWorkingDay(day = new Date()) {
            const today = day.getDay();
            let diff = this.group.working_days.map((day) =>
                getDefInDays(day + 1, today + 1)
            );
            // get the closest day
            const min = Math.min(...diff),
                closestDay = day.getTime() + min * DAY_MILL_SEC;
            // to string
            return new Date(closestDay).toISOString().substr(0, 10);
        },
        // get users full name
        fullName(user) {
            return `${user.first_name} ${user.parent_name || ""}`;
        },
        // get plans of selected date
        async fetchPlansDate() {
            const { plans, plansToTables } = planTable({
                group: this.group,
                courseTitle: this.course.title,
                subgroup: this.subgroup,
                weekDays: this.weekDays,
                versesPerPage: this.versesPerPage,
                surahAdj: this.surahAdj,
                $vuetify: this.$vuetify,
                stringify,
            });
            // update states
            this.updateModel(["plansToTables", plansToTables]);
            this.updateModel(["plans", plans]);
        },
        // convert today plan to string
        getPlanString(plan, details = true) {
            const forToday = stringify({
                courseTitle: this.course.title,
                details,
                versesPerPage: this.versesPerPage,
                surahAdj: this.surahAdj,
                $vuetify: this.$vuetify,
                ...plan,
            });
            return (
                forToday || this.$vuetify.lang.t("$vuetify.nothingTodayMessage")
            );
        },
        // advantage divider unless it is the last one
        advantageDivider(pi) {
            return pi + 1 != this.plansOfDate.length;
        },
        // get allowed dates in calender (avoiding not working days)
        allowedDates(val) {
            const weekDay = new Date(val).getDay();
            return weekDay in this.groupWorkingDays;
        },
        // remove plan
        async deletePlan(id) {
            await this.removePlan(id);
            this.fetchPlansDate();
        },
    },
};
</script>

<style lang="sass">
.v-rating
    width: 100%
    .v-icon
        padding: 0 !important
</style>
