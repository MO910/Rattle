<template lang="pug" key="index">
v-dialog(v-model='dialog' width="500")
    template(v-slot:activator='{ on, attrs }')
        v-btn(color='red lighten-2' dark='' v-bind='attrs' v-on='on')
            | add plan
    v-card
        v-card-title.text-h5.text-capitalize add plan
        v-card-text
                v-row
                    v-col(cols='12')
                        v-select(
                            label="سورة"
                            v-model='selectedSurah'
                            :items='surahSearchResults'
                        )
                            template(v-slot:prepend-item)
                                v-list-item
                                    v-text-field.d-block(
                                        v-model="surahSearch"
                                        name="email"
                                        label="بحث"
                                    )
                                v-divider
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | from ayah
                    v-col.d-flex.justify-end.align-center(cols='6')
                        inputNumber(
                            model='addPlanForm.ayahValue'
                            key='ayahValue'
                            id_key='ayahValue'
                            :init='addPlanForm.ayahValue || 1'
                        )
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | pages per day
                    v-col.d-flex.justify-end.align-center(cols='6')
                        inputNumber(
                            model='addPlanForm.pagesValue'
                            key='pagesValue'
                            id_key='pagesValue'
                            :init='addPlanForm.pagesValue || 1'
                        )
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | weeks
                    v-col.d-flex.justify-end.align-center(cols='6')
                        v-slider.align-center(v-model='weeks' :min='min' :max='maxWeeks' hide-details)
                            template(v-slot:thumb-label="props") {{props.value}}
                    v-col(cols='12')
                        v-divider
                    v-col.text-h6(cols='12')
                        v-switch(
                            v-model="has_rabt"
                            label="has rabt"
                        )
                v-row(v-if='has_rabt')
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | rabt pages per day
                    v-col.d-flex.justify-end.align-center(cols='6')
                        inputNumber(
                            model='addPlanForm.rabtPagesValue'
                            key='rabtPagesValue'
                            id_key='rabtPagesValue'
                            :init='addPlanForm.rabtPagesValue || 1'
                        )
                v-row
                    v-col(cols='12')
                        v-divider
                    v-col(cols='12')
                        .text-h6.font-weight-regular.text-capitalize working days
                        v-btn-toggle(v-model="days_selected" mandatory multiple group dense color="cyan darken-3")
                            v-btn.mr-3(v-for='(d, i) in days' :key='i') {{d}}
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | starting at day
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        v-menu(v-model='dateMenu' :close-on-content-click='false' :nudge-right='40' transition='scale-transition' offset-y min-width='auto')
                            template(v-slot:activator='{ on, attrs }')
                                v-text-field(v-model='starting_at' readonly v-bind='attrs' v-on='on')
                            v-date-picker(v-model='starting_at' @input='dateMenu = false')
        v-card-actions
            v-spacer
            v-btn(color='primary' text @click='addPlan') add
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    data: () => ({
        dialog: false,
        has_rabt: false,
        dateMenu: false,
        selectedSurah: "",
        surahSearch: "",
        min: 1,
        max: 90,
        maxWeeks: 52,
        ayahValue: 1,
        weeks: 1,
        pagesValue: 1,
        starting_at: new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
        )
            .toISOString()
            .substr(0, 10),
        days: ["sun", "mon", "tue", "wed", " thu", "fri", "sat"],
        days_selected: [0],
    }),
    props: ["default_days"],
    mounted() {
        this.days_selected = this.default_days;
        // console.log(this.surahAdj.chapters);
    },
    computed: {
        ...mapState(["addPlanForm", "surahAdj"]),
        surahSearchResults() {
            const surahsNames = this.surahAdj.chapters.map(
                    (s) => s.name_arabic
                ),
                searchForReg = new RegExp(this.surahSearch.replace(/\s/g, "")),
                cleanReg = new RegExp("[^\u0621-\u063A^\u0641-\u064A]", "g");
            return surahsNames.filter((s) =>
                s.replace(cleanReg, "").match(searchForReg)
            );
        },
    },
    methods: {
        addPlan() {
            this.dateMenu = false;
            console.log("selectedSurah", this.selectedSurah);
            console.log("weeks", this.weeks);
            console.log("has_rabt", this.has_rabt);
            console.log("days_selected", this.days_selected);
            console.log("starting_at", this.starting_at);
        },
    },
};
</script>
