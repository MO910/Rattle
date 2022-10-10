import { generatePlanDays } from "./generatePlanDays";
// function
const planTable = ({
    group,
    courseTitle,
    subgroup,
    weekDays,
    stringify,
    versesPerPage,
    surahAdj,
    $vuetify,
}) => {
    let plans = [],
        plansToTables = [];
    // generate plans
    subgroup.plans.forEach((plan) => {
        plans.push(generatePlanDays(group, plan));
    });
    // style to fit table
    plans.forEach((plan) => {
        let spreadPlan = [];
        let working_days = plan.days.working_days?.length
                ? plan.days.working_days
                : group.working_days,
            plansTemp = [...plan.days];
        while (plansTemp.length)
            spreadPlan.push(plansTemp.splice(0, working_days.length));
        spreadPlan = spreadPlan.map((week) => {
            let weekObj = {};
            week.forEach((day, i) => {
                weekObj[weekDays[i]] = stringify({
                    title: plan.title,
                    day,
                    courseTitle,
                    versesPerPage,
                    surahAdj,
                    $vuetify,
                    showDate: true,
                });
            });
            return weekObj;
        });
        plansToTables.push(spreadPlan);
    });

    return { plans, plansToTables };
};

export { planTable };
