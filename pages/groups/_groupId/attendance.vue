<template lang="pug">
v-container
    v-row.mt-8
        v-col(cols='3')
            date-picker(
                :historyAction='groupAttendanceAtDate'
                :historyParams='historyParams'
            )
        v-col.px-6(cols='12')
            v-row
                v-col(cols='4') {{$vuetify.lang.t('$vuetify.student')}}
                v-col(cols='3') {{$vuetify.lang.t('$vuetify.attendance_status')}}
                v-col(cols='5') {{$vuetify.lang.t('$vuetify.note')}}
        v-col(cols='12' v-if='datePicker.fetching') fetching!!
        v-col(cols='12' v-if='!datePicker.fetching')
            v-card.mb-8.px-6(v-for='student, si in selectedDateHistory' :key='si')
                v-row
                    v-col(cols='4').d-flex.align-center {{student.first_name}}
                    v-col(cols='3').d-flex.align-center.justify-space-between
                        v-tooltip(
                            v-for='state, i in status' :key='i'
                            :color='state.color' bottom open-delay='350'
                        ) 
                            template(v-slot:activator="{ on, attrs }")
                                v-btn(
                                    icon rounded large
                                    v-bind="attrs" v-on="on"
                                    @click='changeStatus(student, state.title, colorAt(si, i))'
                                    :color="colorAt(si, i)"
                                )
                                    v-icon {{state.icon}}
                            span.text-capitalize {{$vuetify.lang.t(`$vuetify.${state.title}`)}}
                    v-col(cols='5').px-3.align-center
                        v-textarea(
                            name="Note" rows="1" auto-grow
                            :value='getNote(student)'
                            hint='saving...'
                            @input='changeNote(student, $event)'
                            :placeholder="$vuetify.lang.t(`$vuetify.typeYourNote`)"
                        )
                            v-btn flk;dsja
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    async fetch({ $auth, store, redirect }) {
        if (!$auth.$state.loggedIn || !$auth.$state.user)
            return redirect("/login");
    },
    data: () => ({
        timeout: null,
        status: [
            {
                title: "attended",
                icon: "mdi-check",
                color: "green",
            },
            {
                title: "absent",
                icon: "mdi-window-close",
                color: "error",
            },
            {
                title: "late",
                icon: "mdi-clock-time-nine",
                color: "lime darken-2",
            },
            {
                title: "excused",
                icon: "mdi-note",
                color: "yellow darken-4",
            },
        ],
    }),
    async mounted() {
        // await this.groupAttendanceAtDate({
        //     ...this.historyParams,
        //     date: this.datePicker.selectedDate,
        // });
    },
    computed: {
        ...mapState(["AttendanceHistory", "datePicker"]),
        selectedDateHistory() {
            return this.AttendanceHistory.filter(
                (h) => h.date.slice(0, 10) == this.datePicker.selectedDate
            )?.[0]?.students;
        },
        historyParams() {
            const { groupId: group_id } = this.$route.params;
            return { group_id };
        },
    },
    methods: {
        ...mapActions(["groupAttendanceAtDate", "updateAttendance"]),
        stateAt(si) {
            const attendance_status =
                this.selectedDateHistory?.[si].attendance?.attendance_status;
            if (!attendance_status) return null;
            return this.status.map((s) => s.title).indexOf(attendance_status);
        },
        colorAt(si, i) {
            let state = this.stateAt(si);
            return state === i ? this.status[state]?.color : "";
        },
        async changeAttendance(user_id, args) {
            // if (isActive) return;
            console.log("changed: ", args);
            await this.updateAttendance({
                user_id,
                ...args,
                date: this.datePicker.selectedDate,
            });
        },
        async changeStatus(user, attendance_status, isActive) {
            if (isActive) return;
            return await this.changeAttendance(user.id, { attendance_status });
        },
        changeNote(user, note, delay = 1000) {
            // debounce algorithm to save request and speed up the experience
            const callback = () =>
                this.changeAttendance(user.id, { note }, delay);
            clearTimeout(this.timeout);
            this.timeout = setTimeout(callback, delay);
        },
        getNote(student) {
            return student.attendance?.note;
        },
    },
};
</script>
