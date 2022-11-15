import { pageToVerse } from "./stringify";
//
const DAY_MILL_SEC = 24 * 60 * 60 * 1000;
// the function
const generatePlanDays = (group, plan, versesPerPage) => {
    let working_days = plan.working_days?.length
        ? plan.working_days
        : group.working_days;
    plan.days = [];
    let pagePointer = plan.from;
    // rabt
    let rabtPlan = plan.rabt_amount && {
        ...plan,
        title: `rabt of ${plan.title}`,
        rabt_for_plan_id: plan.id,
        days: [],
    };
    // some calcs
    let { starting_at, decreaseMillSec } = calcs({
        working_days,
        starting_at: plan.starting_at,
    });
    // total mainDays
    const totalDays = plan.weeks * working_days.length;
    // fill mainDays array
    for (let i = 0; i < totalDays; i++) {
        // add main range and date
        let mainDay = {
            date:
                starting_at +
                decreaseMillSec[i % decreaseMillSec.length] * +!!i,
            from: pagePointer,
            to:
                pagePointer +
                (plan.amount - 1 * !(plan.amount % 1)) *
                    (-1) ** plan.order_reversed,
        };
        // add rabt
        if (rabtPlan && i) {
            // if (!i)
            //     rabtPlan.days.push({
            //         date: mainDay.date,
            //     });
            // else {
            let from = Math[plan.order_reversed ? "min" : "max"](
                    mainDay.from -
                        plan.rabt_amount * (-1) ** plan.order_reversed,
                    plan.from
                ),
                to =
                    from +
                    (plan.rabt_amount - 1 * !(plan.amount % 1)) *
                        (-1) ** plan.order_reversed;
            var rabtDay = {
                date: mainDay.date,
                from,
                to,
            };
            // !for testing
            // mainDay = {
            //     ...mainDay,
            //     rabt_from: from,
            //     rabt_to: to,
            // };
            // !^^^^^^^^^^^^^^^
            // push to days
            rabtPlan.days.push(rabtDay);
            // }
        }
        // close
        starting_at = mainDay.date;
        pagePointer += plan.amount * (-1) ** plan.order_reversed;
        // push to days
        plan.days.push(mainDay);
    }
    // format date to Date Object
    plan.days.map((d) => (d.date = new Date(+d.date)));
    // rabt styling the object
    if (rabtPlan) {
        rabtPlan.days.map((d) => (d.date = new Date(+d.date)));
        delete rabtPlan.rabt_amount;
        // rabtPlan.rabt_for_plan_id = plan.id;
    }
    // page numbers to verse keys
    const allPlans = [plan];
    if (allPlans) allPlans.push(rabtPlan);
    allPlans.forEach((plan) => {
        plan.days = plan.days.map((day) => ({
            ...day,
            ...pageToVerse({
                ...day,
                verseKeyObj: true,
                consValues: { versesPerPage },
            }),
        }));
    });
    // style for DB
    delete plan.rabt_amount;
    // return
    return allPlans;
};
// get deferent in days
const getDefInDays = (d1, d2) => (d1 >= d2 ? d1 - d2 : 7 - d2 + d1);
// isolate some calc
const calcs = ({ working_days, starting_at }) => {
    let decreaseMillSec = [];
    // calculate decrease in MillSec
    working_days = working_days.map((d) => ++d);
    working_days.forEach((day, i) => {
        decreaseMillSec.push(getDefInDays(day, working_days.at(i - 1)));
    });
    decreaseMillSec = decreaseMillSec.map((d) => d * DAY_MILL_SEC);
    // set pointer to first day in week
    starting_at = getDayInWeek(starting_at, working_days[0]);
    return { starting_at, decreaseMillSec };
};
const getDayInWeek = (date, dayI) => {
    date = new Date(+date);
    let decreaseBy = 0;
    if (date.getDay() + 1 !== dayI) {
        const defInDay = getDefInDays(dayI, date.getDay() + 1);
        decreaseBy = defInDay * DAY_MILL_SEC;
    }
    return new Date(+date + decreaseBy).getTime();
};
// export
export { DAY_MILL_SEC, generatePlanDays, getDefInDays };
