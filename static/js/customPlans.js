import { generatePlanDays } from "./generatePlanDays";
import { stringify } from "./stringify";
// function
const customPlans = ({
    group,
    courseTitle,
    plan,
    weekDays,
    versesPerPage,
    surahAdj,
    $vuetify,
}) => {
    // generate plans
    let plans = generatePlanDays(group, {
        ...plan,
        // order_reversed: true,
        // from: 500,
        // amount: 1,
        // rabt_amount: 1,
    });
    // style to fit table
    let plansToTables = plans.reduce((acc, plan) => {
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
        acc.push(spreadPlan);
        return acc;
    }, []);
    return { plans, plansToTables };
};

export { customPlans };
