<template lang="pug">
v-row
    //- |{{selectedDateHistory}}
    v-col(cols='4')
        v-card-text {{verseName}}
    v-col.d-flex.justify-end.align-center(cols='8')
        v-slider.align-center(
            @end="changeAmount($event)"
            @input="changeAmount($event, true)"
            :value="amount_done"
            min=1
            :max='versesKeys.length'
            ticks
            hide-details
        )
    template(v-if='!disableRatting')
        //- v-col(cols='12')
            v-card-text {{selectedDateHistory}}
        v-col(cols='4')
            v-card-text {{$vuetify.lang.t("$vuetify.grade")}}: {{this.history.grade}} / 10
        v-col.d-flex.justify-end.align-center(cols='8')
            v-rating.d-flex.justify-space-between.align-center(
                @input="changeRating"
                :value="ratingRatio * ratingLength"
                background-color="grey"
                color="blue"
                hover
                :half-increments='ratingLength < 10'
                :length="ratingLength"
                size="30"
            )
        v-col(cols='12' v-if='divider')
            v-divider
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { verseKeyToName } from "~/static/js/stringify";
export default {
    data: () => ({
        ratingLength: 5,
    }),
    props: ["plan", "student_id", "selectedDate", "divider"],
    async mounted() {
        // rating length
        /*
            this.windowWidth = window.innerWidth;
            window.onresize = () => {
                this.windowWidth = window.innerWidth;
            };
        */
    },
    computed: {
        ...mapState(["versesPerPage", "selectedDateHistory"]),
        versesKeys() {
            const { from, to } = this.plan.day;
            let allVerses = [];
            for (let i = from - 1; i < to; i++)
                allVerses.push(this.versesPerPage.pages[i]);
            return allVerses.flat().map((v) => v?.verse_key);
            // this.verseKeyToName()
        },
        verseName() {
            const currentVerse = this.versesKeys[this.amount_done - 1];
            return currentVerse && verseKeyToName(currentVerse);
        },
        disableRatting() {
            // this.ratingRatio = 0;
            return this.amount_done < this.versesKeys.length;
        },
        date() {
            return new Date(this.selectedDate).toLocaleString().split(",")[0];
        },
        history() {
            return (
                this.selectedDateHistory?.filter((h, i) => {
                    if (
                        h.plan_id == this.plan.id &&
                        h.student_id == this.student_id
                    )
                        this.historyIndex = i;
                    return (
                        h.plan_id == this.plan.id &&
                        h.student_id == this.student_id
                    );
                })?.[0] || {}
            );
        },
        ratingRatio() {
            return (this.history.grade || 0) / 10;
        },
        amount_done() {
            return this.history?.amount_done || 1;
        },
    },
    methods: {
        ...mapActions(["updateHistory", "getSubgroupHistoryAtDate"]),
        ...mapMutations(["updateModel", "push"]),
        updateHistoryWrapper(obj, key, locallyOnly) {
            // update locally
            if (Object.keys(this.history).length)
                this.updateModel([
                    `selectedDateHistory[${this.historyIndex}].${key}`,
                    obj[key],
                ]);
            else {
                this.historyIndex = this.selectedDateHistory.length;
                this.push([`selectedDateHistory`, obj]);
            }
            // update DB
            if (!locallyOnly) this.updateHistory(obj);
        },
        // change sliders
        changeAmount(n, locallyOnly) {
            const obj = {
                student_id: this.student_id,
                plan_id: this.plan.id,
                date: this.date,
                amount_done: n,
            };
            // update
            this.updateHistoryWrapper(obj, "amount_done", locallyOnly);
        },
        changeRating(n) {
            // if (!this.selectedDateHistory.length) return;
            const grade = (n / this.ratingLength) * 10;
            const obj = {
                student_id: this.student_id,
                plan_id: this.plan.id,
                date: this.date,
                grade,
            };
            // update
            this.updateHistoryWrapper(obj, "grade");
        },
    },
};
</script>
