<template lang="pug">
div
    v-sheet(height='64')
        v-toolbar(flat)
            v-btn.mr-4(outlined @click='setToday')
                | Today
            v-btn(fab text small color='grey darken-2' @click='next')
                v-icon(small) mdi-chevron-right
            v-btn(fab text small color='grey darken-2' @click='prev')
                v-icon(small) mdi-chevron-left
            v-toolbar-title(v-if='$refs.calendar')
                span {{ formatter($refs.calendar.title, {year: true}) }}
    v-sheet
        v-calendar(
            ref='calendar'
            v-model='value'
            color='primary'
            :weekdays='groupWorkingDays'
            :type='type'
            :events='calenderEvents'
            :event-overlap-mode='mode'
            :event-overlap-threshold='30'
            :event-color='getEventColor'
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
        )
            template(v-slot:day-label="{day, date, present}")
                v-row(relative)
                    v-col
                        v-btn(
                            :color='present ? "primary" : ""' :text='!present'
                            rounded fab small elevation='0'
                        ) {{formatter(date, {month: day == 1, day: true})}}
                        v-btn(icon absolute left @click='addEvent(date)')
                            v-icon mdi-plus
        //- edit events dialog
        edit-custom-plan-dialog(
            :isStudent='isStudent'
            :update='updateEvents'
        )
        //- @change='getEvents'
        v-menu(v-model='daySelected.dialog' width="290px" :activator='daySelected.element' offset-x)
            v-card
                //- v-card-title {{daySelected.data.date}}
                //- :class='`${event.color}--text`'
                v-card-text(
                    v-for='event in daySelected.data.day'
                    :key='event.name'
                ) {{event.name}}
        v-menu(v-model='selectedOpen' :close-on-content-click='true' :activator='selectedElement' offset-x)
            v-card(:color='getColor()' min-width='350px' flat)
                //- v-toolbar(:color='selectedEvent.color' dark)
                    v-btn(icon)
                        v-icon mdi-pencil
                    v-toolbar-title(v-html='selectedEvent.name')
                    v-spacer
                    v-btn(icon)
                        v-icon mdi-heart
                    v-btn(icon)
                        v-icon mdi-dots-vertical
                v-card-text
                    span(v-html='selectedEvent.name')
                //- v-card-actions
                    v-btn(text color='secondary' @click='selectedOpen = false')
                        | Cancel
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { calendarEvents } from "~/static/js/calendarEvents";
import { stringify } from "~/static/js/stringify";
export default {
    // middleware: ["fetchGroups"],
    async fetch({ $auth, store, redirect }) {
        if (!$auth.$state.loggedIn || !$auth.$state.user) redirect("/login");
        else await store.dispatch("getGroups");
    },
    async mounted() {
        this.updateEvents();
        //
        const days = document.querySelectorAll(".v-calendar-weekly__day");
        // console.log(days);
    },
    data: () => ({
        type: "month",
        types: ["month", "week", "day", "4day"],
        mode: "stack",
        modes: ["stack", "column"],
        selectedElement: null,
        selectedOpen: false,
        daySelected: {
            dialog: false,
            element: null,
            data: [],
        },
        selectedEvent: {},
        isStudent: false,
        weekday: [0, 1, 2, 3, 4, 5, 6],
        // weekdays: [
        //     { text: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
        //     { text: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
        //     { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
        //     { text: "Mon, Wed, Fri", value: [1, 3] },
        // ],
        value: "",
        // events: [],
        colors: [
            "blue",
            "indigo",
            "deep-purple",
            "cyan",
            "green",
            "orange",
            "grey darken-1",
        ],
        names: [
            "Meeting",
            "Holiday",
            "PTO",
            "Travel",
            "Event",
            "Birthday",
            "Conference",
            "Party",
        ],
    }),
    computed: {
        ...mapState([
            "groups",
            "surahAdj",
            "versesPerPage",
            "plans",
            "calenderEvents",
        ]),
        group() {
            const { groupId } = this.$route.params;
            return this.groups.find((g) => g.id == groupId);
        },
        course() {
            const { courseId } = this.$route.params;
            if (this.group)
                return this.group.courses.find((c) => c.id == courseId);
        },
        subgroup() {
            const { subgroupId } = this.$route.params,
                sub = this.course.subgroups.find((s) => s.id == subgroupId),
                student =
                    sub ||
                    this.course.floatingStudents.find(
                        (s) => s.id == subgroupId
                    );
            this.isStudent = !sub;
            return sub || student;
        },
        groupWorkingDays() {
            return this.group.working_days;
        },
        weekDays() {
            let weekDays = JSON.parse(this.$vuetify.lang.locales.en.weekDays);
            return this.groupWorkingDays.map((di) => weekDays[di]);
        },
    },
    methods: {
        ...mapMutations(["updateModel", "resetEventForm"]),
        updateEvents() {
            const events = calendarEvents({
                courseTitle: this.course.title,
                plans: this.subgroup.plans,
                custom_plans: this.subgroup.plans.map(
                    (plan) => plan.custom_plans
                ),
                weekDays: this.weekDays,
                versesPerPage: this.versesPerPage,
                surahAdj: this.surahAdj,
                $vuetify: this.$vuetify,
                stringify,
            });
            this.updateModel(["calenderEvents", events]);
        },
        formatter(date, { year, month, day } = {}) {
            const lang = this.$vuetify.lang?.current;
            let options = {};
            if (year) options.year = "numeric";
            if (month) options.month = "long";
            if (day) options.day = "numeric";
            const formatter = new Intl.DateTimeFormat(lang, options);
            return formatter.format(new Date(date));
        },
        viewDay({ date, nativeEvent }) {
            // console.log({ date, nativeEvent });
            // const open = () => {
            //     // open dialog
            //     this.daySelected.element = nativeEvent.target;
            //     // this.daySelected.dialog = true;
            //     // filter day events
            //     const min = new Date(`${date}T00:00:00`);
            //     const max = new Date(`${date}T23:59:59`);
            //     const day = this.events.filter(
            //         (e) =>
            //             (e.start < max && e.start > min) ||
            //             (e.end < max && e.end > min)
            //     );
            //     this.daySelected.data = { date, day };
            //     // animation
            //     requestAnimationFrame(() =>
            //         requestAnimationFrame(
            //             () => (this.daySelected.dialog = true)
            //         )
            //     );
            // };
            // // animation
            // if (this.daySelected.dialog) {
            //     this.daySelected.dialog = false;
            //     requestAnimationFrame(() =>
            //         requestAnimationFrame(() => open())
            //     );
            // } else {
            //     open();
            // }
            // nativeEvent.stopPropagation();
        },
        getEventColor(event) {
            return event.color;
        },
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a;
        },
        setToday() {
            this.value = "";
        },
        prev() {
            this.$refs.calendar.prev();
        },
        next() {
            this.$refs.calendar.next();
        },
        showEvent({ nativeEvent, event }) {
            // this.eventForm.dialog = true;
            let custom_plans = this.subgroup.plans
                .map((plan) => plan.custom_plans)
                .flat();
            custom_plans = custom_plans.find((cp) => cp.id === event.id);
            // *update state
            let [fromSurahIndex, fromAyah] = custom_plans.from?.split(":"),
                [toSurahIndex, toAyah] = custom_plans.to?.split(":");
            // date
            this.updateModel(["eventForm.form.date", event.start]);
            // from
            this.updateModel([
                "eventForm.form.fromSurahIndex",
                fromSurahIndex - 1,
            ]);
            this.updateModel([
                "eventForm.form.maxFrom",
                this.surahAdj.chapters[fromSurahIndex - 1].verses_count,
            ]);
            this.updateModel(["eventForm.form.fromAyah", fromAyah]);
            // to
            this.updateModel(["eventForm.form.toSurahIndex", toSurahIndex - 1]);
            this.updateModel([
                "eventForm.form.maxTo",
                this.surahAdj.chapters[toSurahIndex - 1].verses_count,
            ]);
            this.updateModel(["eventForm.form.toAyah", toAyah]);
            // for all
            this.updateModel(["eventForm.data", custom_plans]);
            this.updateModel(["eventForm.edit", true]);
            this.updateModel(["eventForm.dialog", true]);
        },
        addEvent(date) {
            this.resetEventForm();
            this.updateModel(["eventForm.form.date", date]);
            this.updateModel(["eventForm.edit", false]);
            this.updateModel(["eventForm.dialog", true]);
        },
        getColor() {
            return this.selectedEvent?.color || "";
        },
    },
};
</script>
<style lang="sass">
.v-calendar-monthly
    height: auto !important
    .v-calendar-weekly__week
        flex: none
        .v-calendar-weekly__day
            padding: 5px 10px
        .v-event
            height: auto !important
            margin: 10px 0 !important
            padding: 10px
            white-space: break-spaces !important
            &.v-sheet
                width: 95%
                border: 2px green solid
                background: none
</style>
