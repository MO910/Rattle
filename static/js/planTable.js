import { generatePlanDays } from "./generatePlanDays";
// function
const planTable = ({ group, subgroup, weekDays, toString }) => {
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
            week.forEach((d, i) => {
                weekObj[weekDays[i]] = toString(plan.title, d);
            });
            return weekObj;
        });
        plansToTables.push(spreadPlan);
    });

    return { plans, plansToTables };
};

export { planTable };
