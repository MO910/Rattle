// the function
const generatePlanDays = (group, plan) => {
    // console.log("=======================");
    // console.log(plan.title);
    let working_days = plan.working_days.length
            ? plan.working_days
            : group.working_days,
        decreaseMillSec = [];
    // const { id, title } = plan;
    const DAY_MILL_SEC = 24 * 60 * 60 * 1000,
        totalDays = plan.weeks * working_days.length,
        getDefInDays = (d1, d2) => (d1 >= d2 ? d1 - d2 : 7 - d2 + d1);
    // calculate decrease in MillSec
    working_days = working_days.map((d) => ++d);
    working_days.forEach((day, i) => {
        decreaseMillSec.push(getDefInDays(day, working_days.at(i - 1)));
    });
    decreaseMillSec = decreaseMillSec.map((d) => d * DAY_MILL_SEC);
    // set pointer to first day in week
    let days = [],
        pagePointer = plan.from,
        starting_at = new Date(+plan.starting_at),
        decreaseBy = 0;
    if (starting_at.getDay() + 1 !== working_days[0]) {
        const defInDay = getDefInDays(
            working_days[0],
            starting_at.getDay() + 1
        );
        decreaseBy = defInDay * DAY_MILL_SEC;
    }
    starting_at = new Date(+plan.starting_at + decreaseBy).getTime();
    //  fill days array
    for (let i = 0; i < totalDays; i++) {
        // add main range and date
        let day = {
            date:
                starting_at +
                decreaseMillSec[i % decreaseMillSec.length] * +!!i,
            from: pagePointer,
            to: pagePointer + (plan.amount - 1) * (-1) ** plan.order_reversed,
        };
        // console.log(day);
        // add rabt
        if (plan.rabt_amount)
            day.rabt_from = Math.max(day.from - plan.rabt_amount, plan.from);
        // close
        days.push(day);
        starting_at = day.date;
        pagePointer += plan.amount * (-1) ** plan.order_reversed;
    }
    // format date to Date Object
    days.map((d) => (d.date = new Date(d.date)));
    return { ...plan, days };
};

export { generatePlanDays };
