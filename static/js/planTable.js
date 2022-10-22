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
    subgroup?.plans?.forEach((plan) => {
        // preprocess custom plans
        let customPlan;
        if (plan.custom_plans?.length) {
            const [starting_at, ending_at] = plan.custom_plans.reduce(
                (acc, curr) => [
                    Math.min(acc[0], curr.date),
                    Math.max(acc[1], curr.date),
                ],
                [Infinity, -Infinity]
            );
            customPlan = { ...plan, starting_at, ending_at };
        }
        // generate days
        plans.push(
            generatePlanDays(
                group,
                customPlan || plan,
                !!plan.custom_plans?.length
            )
        );
    });
    // style to fit table
    plans.forEach((plan) => {
        let spreadPlan = [],
            working_days = plan.days.working_days?.length
                ? plan.days.working_days
                : group.working_days,
            plansTemp = [...plan.days];
        // push to spread plan arr
        while (plansTemp.length)
            spreadPlan.push(plansTemp.splice(0, working_days.length));
        // loop throw spread
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
