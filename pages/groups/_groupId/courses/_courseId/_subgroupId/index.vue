<template lang="pug" key="index">
v-container 
    .text-h3 {{ subgroup.title }}
    .text-h4 {{ dateStyled }}
    p(v-for='plan in plansOfDate')
        |{{toString(plan.title, plan.days[0], true)}}
        |{{plan.title}}
        //- p(v-for='d in toString(plan.title, plan.days[0], true)')
            v-chip(class="ma-2" color="primary") {{d}}
            //- |{{d.str}}
    addPlan(:default_days='groupWorkingDays')
    | {{subgroup.students}}
    v-row.pt-10
        v-col(
            cols='12'
            v-for='student in subgroup.students'
            :key='student.id'
        )
            v-card.items.px-10.py-5
                v-card-title.text-capitalize.text-h4.pt-6 {{student.name}}
                advantage
    plan-table(:plansToTables='plansToTables' :weekDays='weekDays')
</template>
<script>
import { mapState, mapActions } from "vuex";
import { planTable } from "~/static/js/planTable";
export default {
    middleware: ["fetchGroups"],
    data: () => ({
        plans: [],
        plansToTables: [],
        selectedDate: new Date(1664878909852),
    }),
    mounted() {
        const { plans, plansToTables } = planTable({
            group: this.group,
            subgroup: this.subgroup,
            weekDays: this.weekDays,
            toString: this.toString,
        });
        this.plansToTables = plansToTables;
        this.plans = plans;
        // marge all plans to one block
        plansToTables.slice(1).forEach((plan) => {
            plan.forEach((week, wi) => {
                // console.log(week);
                for (let day in week) {
                    // console.log(plansToTables[0][wi]);
                    plansToTables[0][wi][day] += `\n${week[day]}`;
                }
            });
        });
        //
        this.plansOfDate.forEach((plan) => {
            console.log(this.toString(plan.title, plan.days[0]));
        });
        //
        console.log(this.versesPerPage);
    },
    computed: {
        ...mapState(["groups", "versesPerPage"]),
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
        // rating
        plansOfDate() {
            return this.plans
                .map((p) => {
                    let pClone = { ...p };
                    pClone.days = pClone.days.filter(
                        (d) =>
                            this.zeroClock(d.date).getTime() ==
                            this.zeroClock(this.selectedDate).getTime()
                    );
                    return pClone;
                })
                .filter((plan) => plan.days.length);
        },
        dateStyled() {
            if (!this.plansOfDate.length) return;
            const options = { dateStyle: "full" },
                formatter = new Intl.DateTimeFormat("en-GB", options);
            return formatter.format(this.selectedDate);
        },
    },
    methods: {
        toString(planTitle, obj, details) {
            //
            if (this.course.title.toLowerCase() === "qur0an") {
                return `${planTitle}: from page ${obj.from} to ${obj.to}`;
            } // normal book
            else {
                let de = [];
                let str = `${planTitle}: from page ${obj.from} to ${obj.to}\n`;
                // details
                if (!details) str = `${planTitle}: ${str}`;
                else de.push({ title: planTitle, str });
                // rabt
                if (obj.rabt_from) {
                    if (!details) str = `${planTitle} rabt: `;
                    str += `from page ${obj.rabt_from} to ${Math.max(
                        obj.from - 1,
                        1
                    )}`;
                    if (details) de.push({ title: `${planTitle} rabt`, str });
                }
                return details ? de : str;
            }
        },
        //
        zeroClock(date) {
            date = new Date(date);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
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
