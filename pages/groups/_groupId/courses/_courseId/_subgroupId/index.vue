<template lang="pug" key="index">
v-container 
    v-row
        v-col.text-h3(cols='12') {{ subgroup.title }}
        v-dialog(v-model='dateMenu' width="290px")
            template(v-slot:activator='{ on, attrs }')
                v-col.text-h5(cols='12' v-text='dateStyled' v-bind='attrs' v-on='on')
            v-date-picker(
                v-model='selectedDay'
                @input='getHistory'
                :allowed-dates="allowedDates"
                color="primary"
            )
    v-row.mt-10
        v-col.text-h4(cols='12')
            p.d-inline-block {{$vuetify.lang.t('$vuetify.plans')}}
            addPlan(:default_days='groupWorkingDays' :subgroup_id='subgroup.id')
        v-col.px-0.text-h4.col-md-4.col-sm-6.col-xs-12(v-for='(plan, pi) in plansOfDate' :key='plan.id') 
            v-card.mx-5(@click='openTable(pi)')
                v-card-title.d-block.text-center {{$vuetify.lang.t(`$vuetify.${plan.title}`)}}
                v-card-text {{getPlanString(plan, false)}}
        v-dialog(v-model='tableDialog')
            template(v-slot:activator='{ on, attrs }')
            plan-table(:plansToTables='plansToTables[tableIndex]' :weekDays='weekDays')
    v-row.mt-10
        v-col.text-h4(cols='12') {{$vuetify.lang.t('$vuetify.students')}}
        v-col.px-0.col-xs-12.col-sm-12.col-md-6(
            cols='6'
            v-for='student in subgroup.students'
            :key='student.id'
        )
            v-card.mx-5(:loading="fetching")
                template(slot="progress")
                    v-progress-linear(indeterminate)
                div.py-5.px-10
                    v-card-title.text-capitalize.text-h4.pt-6 {{student.name}}
                    advantage(
                        v-for='plan, pi in plansOfDate'
                        :key='student.id + plan.id + selectedDay'
                        v-if='plan.day && !fetching'
                        :plan='plan'
                        :student_id='student.id'
                        :selectedDate='selectedDate'
                        :divider='advantageDivider(pi)'
                    )
</template>
<script>
import { mapState, mapActions } from "vuex";
import { planTable } from "~/static/js/planTable";
import { stringify } from "~/static/js/stringify";
export default {
    middleware: ["fetchGroups"],
    data: () => ({
        plans: [],
        plansToTables: [],
        selectedDay: "2022-10-04",
        margePlans: [],
        tableIndex: null,
        tableDialog: false,
        dateMenu: false,
        fetching: false,
    }),
    async mounted() {
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
        console.log(plans);
        this.plansToTables = plansToTables;
        this.plans = plans;
        //
        // this.marge();
        //
        await this.getHistory();
        // observer.observe(this, { selectedDate: true });
    },
    computed: {
        ...mapState([
            "groups",
            "surahAdj",
            "versesPerPage",
            "selectedDateHistory",
        ]),
        group() {
            const { groupId } = this.$route.params;
            return this.groups.filter((g) => g.id == groupId)?.[0];
        },
        course() {
            const { courseId } = this.$route.params;
            if (this.group)
                return this.group.courses.filter((c) => c.id == courseId)?.[0];
        },
        subgroup() {
            const { subgroupId } = this.$route.params;
            if (this.course)
                return this.course.subgroups.filter(
                    (s) => s.id == subgroupId
                )?.[0];
        },
        weekDays() {
            let weekDays = JSON.parse(
                this.$vuetify.lang.t("$vuetify.weekDays")
            );
            return this.group.working_days.map((di) => weekDays[di]);
        },
        groupWorkingDays() {
            return this.group?.working_days;
        },
        //
        selectedDate() {
            return new Date(this.selectedDay);
        },
        // rating
        plansOfDate() {
            return this.plans.map((p) => {
                let pClone = { ...p };
                pClone.day = pClone.days.filter(
                    (d) =>
                        this.zeroClock(d.date).getTime() ==
                        this.zeroClock(this.selectedDate).getTime()
                )?.[0];
                delete pClone.days;
                return pClone;
            });
        },
        dateStyled() {
            // if (!this.plansOfDate.length) return;
            let lang = this.$vuetify.lang.current == "en" ? "en-GB" : "ar-EG";
            const options = { dateStyle: "full" },
                formatter = new Intl.DateTimeFormat(lang, options);
            return formatter.format(this.selectedDate);
        },
    },
    methods: {
        ...mapActions(["getSubgroupHistoryAtDate"]),
        // marge all plans to one block
        marge() {
            // get longest plan
            let maxLen = this.plansToTables.reduce(
                (curr, p, i) => {
                    const max = Math.max(p.length, curr[1]);
                    return [max > curr[1] ? i : curr[0], max];
                },
                [0, 0]
            );
            // make it reference
            this.margePlans = [...this.plansToTables[maxLen[0]]];
            // remove it
            this.plansToTables.splice(maxLen[0], 1);
            // loop
            this.plansToTables.forEach((plan) => {
                plan.forEach((week, wi) => {
                    // console.log(week);
                    for (let day in week) {
                        // console.log(plansToTables[0][wi]);
                        console.log(wi, day);
                        console.log("-----------------------");
                        this.margePlans[wi][day] += `\n${week[day]}`;
                    }
                });
            });
        },
        //
        getPlanString(plan, details = true) {
            const s = stringify({
                courseTitle: this.course.title,
                details,
                versesPerPage: this.versesPerPage,
                surahAdj: this.surahAdj,
                $vuetify: this.$vuetify,
                ...plan,
            });
            console.log(s);
            return s;
        },
        //
        openTable(i) {
            this.tableIndex = i;
            this.tableDialog = true;
        },
        // date
        zeroClock(date) {
            date = new Date(date);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        },
        // advantage divider
        advantageDivider(pi) {
            return pi + 1 != this.plansOfDate.length;
        },
        // get history
        async getHistory() {
            this.dateMenu = false;
            this.fetching = true;
            await this.getSubgroupHistoryAtDate({
                subgroup_id: this.subgroup.id,
                date: this.selectedDate.toLocaleString().split(",")[0],
            });
            this.fetching = false;
        },
        //
        allowedDates(val) {
            const weekDay = new Date(val).getDay();
            return weekDay in this.groupWorkingDays;
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
