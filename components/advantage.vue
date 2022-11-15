<template lang="pug">
v-row
    v-col(cols='4')
        v-card-text {{verseName}}
    v-col.d-flex.justify-end.align-center(cols='8')
        v-slider.align-center(
            @end="changeAmount($event,)"
            @change="changeAmount($event, true)"
            :value="amount_done"
            min=1
            :max='versesKeys.length'
            ticks
            hide-details
        )
    template(v-if='!disableRatting')
        v-col(cols='4')
            v-card-text {{$vuetify.lang.t("$vuetify.grade")}}: {{this.history && this.history.grade}} / 10
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
import { extractISODate } from "~/static/js/extractISODate";
export default {
    data: () => ({
        ratingLength: 5,
    }),
    props: ["plan", "student_id", "selectedDate", "divider"],
    async mounted() {},
    computed: {
        ...mapState(["versesPerPage", "surahAdj", "selectedDateHistory"]),
        versesKeys() {
            const { from, to } = this.plan.day;
            const [fromSurah, fromAyah] = from.split(":");
            const [toSurah, toAyah] = to.split(":");
            let allVerses = [];
            // fill the array
            for (let surahI = fromSurah - 1; surahI < toSurah; surahI++) {
                let toInThisSurah =
                    surahI == toSurah - 1
                        ? toAyah
                        : this.surahAdj[surahI].verses_count;
                for (let ayahI = fromAyah - 1; ayahI < toInThisSurah; ayahI++)
                    allVerses.push(`${surahI + 1}:${ayahI + 1}`);
            }
            return allVerses;
        },
        verseName() {
            const currentVerse = this.versesKeys[this.amount_done - 1];
            return currentVerse && verseKeyToName(currentVerse, this);
        },
        disableRatting() {
            return this.amount_done < this.versesKeys.length;
        },
        date() {
            return new Date(this.selectedDate).toLocaleString().split(",")[0];
        },
        history() {
            return this.selectedDateHistory?.filter((h, i) => {
                let date = extractISODate({ date: h.date, time: true }),
                    selectedDate = extractISODate({
                        date: this.selectedDate,
                        time: true,
                    });
                let conditions =
                    date == selectedDate &&
                    h.plan_id == this.plan.id &&
                    h.student_id == this.student_id &&
                    h.custom_plan_id == this.plan.day.id;
                if (conditions) this.historyIndex = i;
                return conditions;
            })?.[0];
        },
        ratingRatio() {
            return (this.history?.grade || 0) / 10;
        },
        amount_done() {
            return this.history?.amount_done || 1;
        },
    },
    methods: {
        ...mapActions(["updatePlanHistory", "getSubgroupHistoryAtDate"]),
        ...mapMutations(["updateModel", "push"]),
        updateHistoryWrapper(obj, key, locallyOnly) {
            obj = {
                student_id: this.student_id,
                plan_id: this.plan.id,
                custom_plan_id: this.plan.day.id,
                // default values
                amount_done: this.amount_done,
                grade: this.history?.grade || 0,
                // new value
                ...obj,
            };
            // update locally
            if (this.history)
                this.updateModel([
                    `selectedDateHistory[${this.historyIndex}].${key}`,
                    obj[key],
                ]);
            else {
                this.historyIndex = this.selectedDateHistory.length;
                let date = extractISODate({ date: this.selectedDate });
                let newObj = {
                    ...obj,
                    date,
                };
                this.push([`selectedDateHistory`, newObj]);
            }
            // update DB
            if (!locallyOnly) this.updatePlanHistory(obj);
        },
        // change sliders
        changeAmount(amount_done, locallyOnly) {
            // update
            this.updateHistoryWrapper(
                { amount_done },
                "amount_done",
                locallyOnly
            );
        },
        changeRating(n) {
            // if (!this.selectedDateHistory.length) return;
            const grade = (n / this.ratingLength) * 10;
            // update
            this.updateHistoryWrapper({ grade }, "grade");
        },
    },
};
</script>
