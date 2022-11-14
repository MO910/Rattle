// function
const calendarEvents = ({
    courseTitle,
    stringify,
    versesPerPage,
    surahAdj,
    $vuetify,
    plans,
}) => {
    let events = [];
    // style to fit calendar
    plans.forEach((plan) => {
        console.log("color :", plan.color);
        console.log("custom_plans :", plan.custom_plans);
        plan.custom_plans.forEach((day) => {
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
                id: day.id,
                start: new Date(+day.date),
                end: new Date(+day.date),
                name,
                color: plan.color || "primary",
            });
        });
    });

    return events;
};

export { calendarEvents };
