<template lang="pug">
    v-dialog.addHabitDialog(v-model='addHabitForm.dialog' persistent max-width='600px')
        v-card
            v-card-title
                span.text-h4.text-capitalize new habit
            v-card-text
                v-container
                    v-row
                        v-col(cols='12')
                            v-text-field(v-model='title' label='Title' required)
                        //- frequency
                        v-col(cols='12')
                            .text-h6.font-weight-regular.text-capitalize frequency
                            v-btn-toggle(v-model="frequency_selected" mandatory group dense color="cyan darken-3")
                                v-btn.mr-3(v-for='(f, i) in frequency' :key='i') {{f}}
            v-card-actions
                v-spacer
                v-btn(color='blue darken-1' text @click='close')
                    | Close
                v-btn(color='blue darken-1' text @click='add')
                    | Save
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    // props: ["dialog"],
    data: () => ({
        title: "",
        // frequency
        frequency: ["daily", "weekly", "monthly", "interval"],
        frequency_selected: 0,
        days: ["sun", "mon", "tue", "wed", " thu", "fri", "sat"],
        days_selected: [0, 1, 2, 3, 4, 5, 6],
        //
        achieveItAll: false,
        units: ["kg", "cups", "meter", "pray"],
        count: 2,
        unit_selected: "kg",
        isPartsLabeled: false,
        partsLabel: [],
        //
        timeOfDay: ["morning", "afternoon", "evening"],
        timeOfDay_selected: [0, 1, 2],
        // Goal Days
        goalDays: [
            "forever",
            "7 days",
            "30 days",
            "100 days",
            "365 days",
            "custom",
        ],
        goalDays_selected: "forever",
        //
        isBad: false,
    }),
    computed: mapState(["addHabitForm"]),
    methods: {
        ...mapActions(["addHabit"]),
        ...mapMutations(["updateModel"]),
        close() {
            this.updateModel(["addHabitForm.dialog", false]);
        },
        add() {
            let newHabit = {};
            newHabit.title = this.title;
            //frequency
            newHabit.frequency = {
                type: this.frequency[this.frequency_selected],
            };
            let {
                weekly_selector,
                monthly_selector,
                interval_selector,
                goal_count,
            } = this.$store.state.addHabitForm;
            switch (this.frequency_selected) {
                case 0:
                    newHabit.frequency.days = this.days_selected;
                    break;
                case 1:
                    newHabit.frequency.days = +weekly_selector;
                    break;
                case 2:
                    newHabit.frequency.days = +monthly_selector;
                    break;
                case 3:
                    newHabit.frequency.days = +interval_selector;
                    break;
            }
            newHabit.frequency.days = JSON.stringify(newHabit.frequency.days);
            // goal
            newHabit.goal = {
                achieveItAll: this.achieveItAll,
            };
            if (!this.achieveItAll) {
                newHabit.goal.count = +goal_count;
                newHabit.goal.unit = this.unit_selected;
                if (this.isPartsLabeled)
                    newHabit.goal.partsLabel = JSON.stringify(this.partsLabel);
            }
            //goalDays
            newHabit.goalDays = this.goalDays_selected;
            //timeOfDay
            newHabit.timeOfDay = this.timeOfDay_selected;
            // is bad
            newHabit.isBad = this.isBad;
            // take action
            this.addHabit(newHabit);
            this.close();
        },
    },
};
</script>

<style lang="sass">
// .v-overlay--active .v-overlay__scrim
//     opacity: 1 !important
//     background-color: hsl(0deg 0% 0% / 1%) !important
//     backdrop-filter: blur(3px) !important
</style>
