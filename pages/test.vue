<template>
    <v-row class="fill-height">
        <v-col>
            <v-sheet height="600">
                <v-calendar
                    ref="calendar"
                    v-model="value"
                    color="primary"
                    type="month"
                    :events="events"
                    :event-color="getEventColor"
                    :event-ripple="false"
                    @change="getEvents"
                    @mousedown:event="startDrag"
                    @mousedown:day="startTime"
                    @mousemove:day="mouseMove"
                    @mouseup:day="endDrag"
                >
                </v-calendar>
            </v-sheet>
        </v-col>
    </v-row>
</template>
<script>
export default {
    data: () => ({
        value: "",
        events: [],
        colors: [
            "#2196F3",
            "#3F51B5",
            "#673AB7",
            "#00BCD4",
            "#4CAF50",
            "#FF9800",
            "#757575",
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
        dragEvent: null,
        dragStart: null,
        createEvent: null,
        createStart: null,
        extendOriginal: null,
    }),
    methods: {
        startDrag({ event, timed }) {
            console.log("start drag");
            if (event && timed) {
                this.dragEvent = event;
                this.dragTime = null;
                this.extendOriginal = null;
            }
        },
        startTime(tms) {
            const mouse = this.toTime(tms);

            console.log("start time");
            if (this.dragEvent && this.dragTime === null) {
                const start = this.dragEvent.start;

                this.dragTime = mouse - start;
            }
            // else {
            //     this.createStart = this.roundTime(mouse);
            //     this.createEvent = {
            //         name: `Event #${this.events.length}`,
            //         color: this.rndElement(this.colors),
            //         start: this.createStart,
            //         end: this.createStart,
            //         timed: true,
            //     };

            //     this.events.push(this.createEvent);
            // }
        },
        mouseMove(tms) {
            const mouse = this.toTime(tms);

            // console.log(this.dragEvent, this.dragTime);
            if (this.dragEvent && this.dragTime) {
                console.log("moving");
                const start = this.dragEvent.start;
                const end = this.dragEvent.end;
                const duration = end - start;
                const newStartTime = mouse - this.dragTime;
                const newStart = this.roundTime(newStartTime);
                const newEnd = newStart + duration;

                this.dragEvent.start = newStart;
                this.dragEvent.end = newEnd;
            }
            // else if (this.createEvent && this.createStart !== null) {
            //     const mouseRounded = this.roundTime(mouse, false);
            //     const min = Math.min(mouseRounded, this.createStart);
            //     const max = Math.max(mouseRounded, this.createStart);

            //     this.createEvent.start = min;
            //     this.createEvent.end = max;
            // }
        },
        endDrag() {
            console.log("end");
            this.dragTime = null;
            this.dragEvent = null;
            this.createEvent = null;
            this.createStart = null;
            this.extendOriginal = null;
        },
        roundTime(time, down = true) {
            const roundTo = 15; // minutes
            const roundDownTime = roundTo * 60 * 1000;

            return down
                ? time - (time % roundDownTime)
                : time + (roundDownTime - (time % roundDownTime));
        },
        toTime(tms) {
            return new Date(
                tms.year,
                tms.month - 1,
                tms.day,
                tms.hour,
                tms.minute
            ).getTime();
        },
        getEventColor(event) {
            const rgb = parseInt(event.color.substring(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = (rgb >> 0) & 0xff;

            return event === this.dragEvent
                ? `rgba(${r}, ${g}, ${b}, 0.7)`
                : event === this.createEvent
                ? `rgba(${r}, ${g}, ${b}, 0.7)`
                : event.color;
        },
        getEvents({ start, end }) {
            const events = [];

            const min = new Date(`${start.date}T00:00:00`).getTime();
            const max = new Date(`${end.date}T23:59:59`).getTime();
            const days = (max - min) / 86400000;
            const eventCount = this.rnd(days, days + 20);

            for (let i = 0; i < eventCount; i++) {
                const timed = this.rnd(0, 3) !== 0;
                const firstTimestamp = this.rnd(min, max);
                const secondTimestamp = this.rnd(2, timed ? 8 : 288) * 900000;
                const start = firstTimestamp - (firstTimestamp % 900000);
                const end = start + secondTimestamp;

                events.push({
                    name: this.rndElement(this.names),
                    color: this.rndElement(this.colors),
                    start,
                    end,
                    timed,
                });
            }

            this.events = events;
        },
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a;
        },
        rndElement(arr) {
            return arr[this.rnd(0, arr.length - 1)];
        },
    },
};
</script>
