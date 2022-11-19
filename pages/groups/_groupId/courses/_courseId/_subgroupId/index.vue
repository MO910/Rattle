<template lang="pug" key="index">
v-container
    v-row
        //- v-col.text-h3(cols='12') {{ subgroup.title || fullName(subgroup)}}
        date-picker(
            :historyAction='getSubgroupHistoryAtDate'
            :historyParams='historyParams'
            :allowedDates='allowedDates'
        )
    //- plans
    v-row.mt-10
        v-col(cols='12')
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
                :group='group'
                :subgroup_id='subgroup.id'
                :isStudent='isStudent'
            )
    v-row.mt-10(v-if='plansOfDate.length')
        v-col.px-0.text-h4.col-md-4.col-sm-6.col-xs-12(
            v-for='(plan, pi) in plansOfDate'
            :key='pi'
            v-if='!plan.hide'
        )
            v-card.mx-5(:color='plan.color')
                v-btn(@click='deletePlan(plan.id)' icon)
                    v-icon mdi-delete
                v-card-title.d-block.text-center {{$vuetify.lang.t(`$vuetify.${plan.title}`)}}
                v-card-text(
                    v-for='strings, i in getPlanString(plan, false)' :key='i'
                    v-text='strings'
                ) 
    v-row(v-else)
        v-col.text-h5(cols='12') there is no plans. do you want to add one!
    //- students of subgroup
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
                :notRouter='true'
                :loading="datePicker.fetching"
                type='student'
            )
            //- :selectedDate='datePicker.selectedDate'
        v-col(v-if='!subgroup.students.length' cols='12')
            .text-h5 there is no students in this subgroup. do you want to add one!
            v-btn add students
            v-btn remove subgroup
    v-row.mt-10(v-else)
        v-col.px-0(cols='12' v-if='dayExist')
            v-card.mx-5(:loading="datePicker.fetching")
                template(slot="progress")
                    v-progress-linear(indeterminate)
                div.py-5.px-10
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
import { stringify } from "~/static/js/stringify";
import { extractISODate } from "~/static/js/extractISODate";
import { generatePlanDays } from "~/static/js/generatePlanDays";
import { pageToVerse } from "~/static/js/stringify";
export default {
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
        // let plans = generatePlanDays(
        //     this.group,
        //     {
        //         ...this.subgroup.plans[0],
        //         from: 10,
        //         amount: 2,
        //         rabt_amount: 1,
        //         // order_reversed: true,
        //     },
        //     this.versesPerPage
        // );
        // console.log(plans);
        // console.log(this.versesPerPage);
        // const testVerse = pageToVerse({ from: 434.5, to: 435.5 });
        // console.log("testVerse", testVerse);
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
            return this.groups.find((g) => g.id == groupId);
        },
        // get the Course
        course() {
            const { courseId } = this.$route.params;
            if (this.group)
                return this.group.courses.find((c) => c.id == courseId);
        },
        // get the Subgroup
        subgroup() {
            const { subgroupId } = this.$route.params,
                sub = this.course.subgroups.find((s) => s.id == subgroupId),
                student =
                    sub ||
                    this.course.floatingStudents.find(
                        (s) => s.id == subgroupId
                    );
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
        // for date picker
        historyParams() {
            return { subgroup_id: this.subgroup?.id };
        },
        // get this day plans
        plansOfDate() {
            const plans = [...this.subgroup.plans];
            return plans.map((plan) => {
                let pClone = { ...plan };
                pClone.day = plan.custom_plans?.filter(
                    (d) =>
                        extractISODate({ date: d.date }) ==
                        this.datePicker.selectedDate
                );
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
    },
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["getSubgroupHistoryAtDate", "removePlan"]),
        // get users full name
        fullName(user) {
            return `${user.first_name} ${user.parent_name || ""}`;
        },
        // convert today plan to string
        getPlanString(plan, details = true) {
            let forToday = plan.day?.reduce((acc, curr) => {
                acc.push(
                    stringify({
                        courseTitle: this.course.title,
                        details,
                        versesPerPage: this.versesPerPage,
                        surahAdj: this.surahAdj,
                        $vuetify: this.$vuetify,
                        title: plan.title,
                        day: curr,
                    })
                );
                return acc;
            }, []);
            return forToday?.length
                ? forToday
                : [this.$vuetify.lang.t("$vuetify.nothingTodayMessage")];
        },
        // get allowed dates in calender (avoiding not working days)
        allowedDates(val) {
            const weekDay = new Date(val).getDay();
            return weekDay in this.groupWorkingDays;
        },
        // remove plan
        async deletePlan(id) {
            await this.removePlan(id);
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
