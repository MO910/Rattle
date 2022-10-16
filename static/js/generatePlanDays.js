const DAY_MILL_SEC = 24 * 60 * 60 * 1000;
// the function
const generatePlanDays = (group, plan, custom) => {
    let working_days = plan.working_days?.length
        ? plan.working_days
        : group.working_days;
    let days = [],
        pagePointer = plan.from;
    // some calcs
    let { starting_at, decreaseMillSec } = calcs({
        custom,
        working_days,
        starting_at: plan.starting_at,
    });
    // total days
    const ending_at =
            custom && getDayInWeek(plan.ending_at, working_days.at(-1), custom),
        weeks = Math.ceil(((ending_at - starting_at) / DAY_MILL_SEC + 1) / 7),
        totalDays = custom
            ? weeks * working_days.length
            : plan.weeks * working_days.length;
    console.log("ending_at", ending_at, plan.ending_at, weeks);
    //  fill days array
    for (let i = 0; i < totalDays; i++) {
        let day = {};
        if (!custom) {
            // add main range and date
            day = {
                date:
                    starting_at +
                    decreaseMillSec[i % decreaseMillSec.length] * +!!i,
                from: pagePointer,
                to:
                    pagePointer +
                    (plan.amount - 1) * (-1) ** plan.order_reversed,
            };
            // add rabt
            if (plan.rabt_amount)
                day.rabt_from = Math.max(
                    day.from - plan.rabt_amount,
                    plan.from
                );
            // close
            starting_at = day.date;
            pagePointer += plan.amount * (-1) ** plan.order_reversed;
        } else {
            let date = starting_at + DAY_MILL_SEC * i,
                custom =
                    plan.custom_plans.filter((c) => +c.date === +date)?.[0] ||
                    {};
            day = { date, ...custom };
        }
        // push
        days.push(day);
    }
    // format date to Date Object
    days.map((d) => (d.date = new Date(+d.date)));
    return { ...plan, days };
};
// get deferent in days
const getDefInDays = (d1, d2, custom) =>
    d1 >= d2 || custom ? d1 - d2 : 7 - d2 + d1;
// isolate some calc
const calcs = ({ custom, working_days, starting_at }) => {
    let decreaseMillSec = [];
    // calculate decrease in MillSec
    working_days = working_days.map((d) => ++d);
    working_days.forEach((day, i) => {
        decreaseMillSec.push(getDefInDays(day, working_days.at(i - 1)));
    });
    decreaseMillSec = decreaseMillSec.map((d) => d * DAY_MILL_SEC);
    // set pointer to first day in week
    starting_at = getDayInWeek(starting_at, working_days[0], custom);
    return { starting_at, decreaseMillSec };
};
const getDayInWeek = (date, dayI, custom) => {
    date = new Date(+date);
    let decreaseBy = 0;
    if (date.getDay() + 1 !== dayI) {
        const defInDay = getDefInDays(dayI, date.getDay() + 1, custom);
        decreaseBy = defInDay * DAY_MILL_SEC;
    }
    return new Date(+date + decreaseBy).getTime();
};
// export
export { DAY_MILL_SEC, generatePlanDays, getDefInDays };
