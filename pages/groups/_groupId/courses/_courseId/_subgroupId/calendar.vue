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
            v-toolbar-title(v-if='$refs.calendar') {{ $refs.calendar.title }}

    //- v-sheet.d-flex(tile height='54')
        v-btn.ma-2(icon @click='$refs.calendar.prev()')
            v-icon mdi-chevron-left
        v-select.ma-2(v-model='type' :items='types' dense outlined hide-details label='type')
        v-select.ma-2(v-model='mode' :items='modes' dense outlined hide-details label='event-overlap-mode')
        v-select.ma-2(v-model='weekday' :items='weekdays' dense outlined hide-details label='weekdays')
        v-spacer
        v-btn.ma-2(icon @click='$refs.calendar.next()')
            v-icon mdi-chevron-right
    v-sheet
        //- v-toolbar-title(v-if="$refs.calendar")
                |{{ $refs.calendar.title }}
        v-calendar(
            ref='calendar'
            v-model='value'
            color='primary'
            :weekdays='groupWorkingDays'
            :type='type'
            :events='events'
            :event-overlap-mode='mode'
            :event-overlap-threshold='30'
            :event-color='getEventColor'
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
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
import { calendarDate } from "~/static/js/calendarDate";
import { stringify } from "~/static/js/stringify";
// import { DAY_MILL_SEC, getDefInDays } from "~/static/js/generatePlanDays";
export default {
    // middleware: ["fetchGroups"],
    async fetch({ $auth, store, redirect }) {
        if (!$auth.$state.loggedIn || !$auth.$state.user) redirect("/login");
        else await store.dispatch("getGroups");
    },
    async mounted() {
        // console.log(this.groups);
        await this.fetchPlansDate();
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
        weekday: [0, 1, 2, 3, 4, 5, 6],
        // weekdays: [
        //     { text: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
        //     { text: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
        //     { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
        //     { text: "Mon, Wed, Fri", value: [1, 3] },
        // ],
        value: "",
        events: [],
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
        ...mapState(["groups", "surahAdj", "versesPerPage", "plans"]),
        group() {
            const { groupId } = this.$route.params;
            return this.groups.filter((g) => g.id == groupId)?.[0];
        },
        course() {
            const { courseId } = this.$route.params;
            if (this.group)
                return this.group.courses.filter((c) => c.id == courseId)?.[0];
        },
        subgroup() {
            const { subgroupId } = this.$route.params,
                sub = this.course.subgroups.filter(
                    (s) => s.id == subgroupId
                )?.[0],
                student =
                    sub ||
                    this.course.floatingStudents.filter(
                        (s) => s.id == subgroupId
                    )?.[0];
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
        ...mapMutations(["updateModel"]),
        // fetch plans
        async fetchPlansDate() {
            const { plans, events } = calendarDate({
                group: this.group,
                courseTitle: this.course.title,
                subgroup: this.subgroup,
                weekDays: this.weekDays,
                versesPerPage: this.versesPerPage,
                surahAdj: this.surahAdj,
                $vuetify: this.$vuetify,
                stringify,
            });
            // console.log(plans, events);
            // update states
            // this.updateModel(["events", events]);
            this.events = events;
            this.updateModel(["plans", plans]);
            // marge plans
            // this.marge();
            // get history
            // await this.getHistory();
        },
        viewDay({ date, nativeEvent }) {
            const open = () => {
                // open dialog
                this.daySelected.element = nativeEvent.target;
                // this.daySelected.dialog = true;
                // filter day events
                const min = new Date(`${date}T00:00:00`);
                const max = new Date(`${date}T23:59:59`);
                const day = this.events.filter(
                    (e) =>
                        (e.start < max && e.start > min) ||
                        (e.end < max && e.end > min)
                );
                this.daySelected.data = { date, day };
                // animation
                requestAnimationFrame(() =>
                    requestAnimationFrame(
                        () => (this.daySelected.dialog = true)
                    )
                );
            };

            // animation
            if (this.daySelected.dialog) {
                this.daySelected.dialog = false;
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => open())
                );
            } else {
                open();
            }

            nativeEvent.stopPropagation();
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
            const open = () => {
                this.selectedEvent = event;
                this.selectedElement = nativeEvent.target;
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => (this.selectedOpen = true))
                );
            };

            if (this.selectedOpen) {
                this.selectedOpen = false;
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => open())
                );
            } else {
                open();
            }

            nativeEvent.stopPropagation();
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
</style>
