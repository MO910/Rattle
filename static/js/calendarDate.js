import { generatePlanDays } from "./generatePlanDays";
// function
const calendarDate = ({
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
        events = [];
    // generate plans
    subgroup.plans.forEach((plan) => {
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
    console.log(
        "plans",
        stringify({
            title: plans[0].title,
            day: plans[0].days[0],
            courseTitle,
            versesPerPage,
            surahAdj,
            $vuetify,
            showDate: false,
        })
    );
    // style to fit calendar
    plans.forEach((plan) => {
        plan.days.forEach((day) => {
            const name = stringify({
                title: plan.title,
                day,
                courseTitle,
                versesPerPage,
                surahAdj,
                $vuetify,
                showDate: false,
            });
            events.push({
                start: day.date,
                end: day.date,
                name,
                color: plan.color || "primary",
            });
        });
    });

    return { plans, events };
};

export { calendarDate };
