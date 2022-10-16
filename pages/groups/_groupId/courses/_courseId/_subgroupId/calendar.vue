<template lang="pug">
div
    v-col
        v-sheet(height='64')
            v-toolbar(flat)
                v-btn.mr-4(outlined color='grey darken-2' @click='setToday')
                    | Today
                v-btn(fab text small color='grey darken-2' @click='prev')
                    v-icon(small) mdi-chevron-left
                v-btn(fab text small color='grey darken-2' @click='next')
                    v-icon(small) mdi-chevron-right
                v-toolbar-title(v-if='$refs.calendar') {{ $refs.calendar.title }}

    v-sheet.d-flex(tile height='54')
        v-btn.ma-2(icon @click='$refs.calendar.prev()')
            v-icon mdi-chevron-left
        v-select.ma-2(v-model='type' :items='types' dense outlined hide-details label='type')
        v-select.ma-2(v-model='mode' :items='modes' dense outlined hide-details label='event-overlap-mode')
        v-select.ma-2(v-model='weekday' :items='weekdays' dense outlined hide-details label='weekdays')
        v-spacer
        v-btn.ma-2(icon @click='$refs.calendar.next()')
            v-icon mdi-chevron-right
    v-sheet(height='600')
        //- v-toolbar-title(v-if="$refs.calendar")
                |{{ $refs.calendar.title }}
        v-calendar(
            ref='calendar'
            v-model='value'
            color='primary'
            :weekdays='weekday'
            :type='type'
            :events='events'
            :event-overlap-mode='mode'
            :event-overlap-threshold='30'
            :event-color='getEventColor'
            @click:event="showEvent"
            @change='getEvents'
        )
        v-menu(v-model='selectedOpen' :close-on-content-click='true' :activator='selectedElement' offset-x)
            v-card(color='grey lighten-4' min-width='350px' flat)
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
import { mapState } from "vuex";
export default {
    data: () => ({
        type: "month",
        types: ["month", "week", "day", "4day"],
        mode: "stack",
        modes: ["stack", "column"],
        selectedElement: null,
        selectedOpen: false,
        selectedEvent: {},
        weekday: [0, 1, 2, 3, 4, 5, 6],
        weekdays: [
            { text: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
            { text: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
            { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
            { text: "Mon, Wed, Fri", value: [1, 3] },
        ],
        value: "",
        events: [
            {
                start: new Date().getTime(),
                end: new Date().setDate(15),
                name: "quran",
                color: "red",
                timed: true,
                details: "fksdlajflksadjfas;lkjfdlsak",
            },
        ],
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
    methods: {
        getEvents({ start, end }) {
            console.log(start, end);
            const events = [];

            const min = new Date(`${start.date}T00:00:00`);
            const max = new Date(`${end.date}T23:59:59`);
        },
        h({ start, end }) {
            console.log(start, end);
            const events = [];

            const min = new Date(`${start.date}T00:00:00`);
            const max = new Date(`${end.date}T23:59:59`);
            const days = (max.getTime() - min.getTime()) / 86400000;
            const eventCount = this.rnd(days, days + 20);

            for (let i = 0; i < eventCount; i++) {
                const allDay = this.rnd(0, 3) === 0;
                const firstTimestamp = this.rnd(min.getTime(), max.getTime());
                const first = new Date(
                    firstTimestamp - (firstTimestamp % 900000)
                );
                const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
                const second = new Date(first.getTime() + secondTimestamp);

                events.push({
                    name: this.names[this.rnd(0, this.names.length - 1)],
                    start: first,
                    end: second,
                    color: this.colors[this.rnd(0, this.colors.length - 1)],
                    timed: !allDay,
                });
            }

            this.events = events;
            console.log(this.events);
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
    },
};
</script>
