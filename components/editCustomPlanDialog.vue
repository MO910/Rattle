<template lang="pug" key="index">
v-dialog(
    :value='eventForm.dialog'
    width="570" persistent
)
    v-card
        v-card-title.text-h5.text-capitalize.d-inline-block
            span {{$vuetify.lang.t(`$vuetify.${eventForm.edit ? 'edit' : 'add'}`)}}
        //- other fields
        v-card-text
            v-form(:disabled='disabled')
                v-row
                    //- select date
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | {{$vuetify.lang.t('$vuetify.date')}}
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        v-menu(transition='scroll-y-transition' offset-y)
                            template(v-slot:activator='{ on, attrs }')
                                v-btn.text-right(v-bind='attrs' v-on='on' text block) {{eventForm.form.date}}
                            v-date-picker(:value='eventForm.form.date' @change='changeDate')
                    //- from surah
                    v-col(cols='12')
                        v-select(
                            :label="surahD()"
                            :value='eventForm.form.fromSurahIndex'
                            @change='changeSurah($event, "from")'
                            :items='surahSearchResults'
                            item-text="name"
                            item-value="index"
                        )
                            template(v-slot:prepend-item)
                                v-list-item
                                    v-text-field.d-block(
                                        v-model="surahSearch"
                                        name="from surah"
                                        :label="$vuetify.lang.t('$vuetify.search')"
                                    )
                                v-divider
                    //- from ayah
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | {{ayahD()}}
                    v-col.d-flex.justify-end.align-center(cols='6')
                        inputNumber(
                            model='eventForm.form.fromAyah'
                            key='fromAyah'
                            id_key='fromAyah'
                            :digitWidth='5'
                            :min='1'
                            maxModel='eventForm.form.maxFrom'
                            :max='eventForm.form.maxFrom'
                            :init='eventForm.form.fromAyah || 1'
                        )
                    //- to surah
                    v-col(cols='12')
                        v-select(
                            :label="surahD('to')"
                            :value='eventForm.form.toSurahIndex'
                            @change='changeSurah($event, "to")'
                            :items='surahSearchResults'
                            item-text="name"
                            item-value="index"
                            :disabled='eventForm.form.fromSurahIndex == null'
                        )
                            template(v-slot:prepend-item)
                                v-list-item
                                    v-text-field.d-block(
                                        v-model="surahSearch"
                                        name="to surah"
                                        :label="$vuetify.lang.t('$vuetify.search')"
                                    )
                                v-divider
                    //- from ayah
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | {{ayahD('to')}}
                    v-col.d-flex.justify-end.align-center(cols='6')
                        inputNumber(
                            model='eventForm.form.toAyah'
                            key='toAyah'
                            id_key='toAyah'
                            :digitWidth='5'
                            :min='1'
                            maxModel='eventForm.form.maxTo'
                            :max='eventForm.form.maxTo'
                            :init='eventForm.form.toAyah || 1'
                        )
            v-card-actions
                v-spacer
                v-btn(color='error' text @click='close') {{$vuetify.lang.t('$vuetify.cancel')}}
                template(v-if='eventForm.edit')
                    v-btn(
                        color='error'
                        @click='edit(true)' :loading='removeLoading'
                    ) {{$vuetify.lang.t('$vuetify.remove')}}
                    v-btn(
                        color='primary'
                        @click='edit(false)'
                        :loading='editLoading'
                    ) {{$vuetify.lang.t('$vuetify.edit')}}
                v-btn(
                    v-else
                    color='primary'
                    @click='add' :loading='addLoading'
                ) {{$vuetify.lang.t('$vuetify.add')}}
                //- v-btn(@click='reset') reset
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { generatePlanDays } from "~/static/js/generatePlanDays";
export default {
    data: () => ({
        starting_at: new Date().toISOString().substr(0, 10),
        surahSearch: "",
        direction_selected: 0,
        editLoading: false,
        removeLoading: false,
        addLoading: false,
        disabled: false,
        // fromSurahIndex: 0,
        // toSurahIndex: 0,
    }),
    props: ["isStudent", "update"],
    mounted() {
        console.log(this.eventForm.edit);
        // this.fromSurahIndex = this.destructure();
    },
    computed: {
        ...mapState(["eventForm", "surahAdj", "versesPerPage"]),
        // select surah and search
        surahsNames() {
            return this.surahAdj.chapters
                .map((s) => s.name_arabic)
                .reduce((acc, name, index) => {
                    return [...acc, { name, index }];
                }, []);
        },
        surahSearchResults() {
            const searchForReg = new RegExp(
                    this.surahSearch.replace(/\s/g, "")
                ),
                cleanReg = new RegExp("[^\u0621-\u063A^\u0641-\u064A]", "g");
            // get results
            let results = this.surahsNames.filter((s) =>
                s.name.replace(cleanReg, "").match(searchForReg)
            );
            // reversed
            if (this.direction_selected) results = results.reverse();
            return results;
        },
    },
    methods: {
        ...mapMutations(["updateModel", "resetEventForm"]),
        ...mapActions(["editCustomPlan"]),
        // change date
        changeDate(date) {
            this.updateModel(["eventForm.form.date", date]);
        },
        // translate
        surahD(end = "from") {
            return `${this.$vuetify.lang.t(
                "$vuetify." + end
            )} ${this.$vuetify.lang.t("$vuetify.surah")}`;
        },
        ayahD(end = "from") {
            return `${this.$vuetify.lang.t(
                "$vuetify." + end
            )} ${this.$vuetify.lang.t("$vuetify.ayah")}`;
        },
        // data destructure
        destructure(end = "from", i = 0) {
            return this.eventForm.data[end]?.split(":")[i] - 1;
        },
        capitalize(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        },
        // select surah
        changeSurah(newVal, type) {
            this.updateModel([`eventForm.form.${type}SurahIndex`, newVal]);
            this.updateModel([`eventForm.form.${type}Ayah`, 1]);
            this.updateModel([
                `eventForm.form.max${this.capitalize(type)}`,
                this.surahAdj.chapters[newVal].verses_count,
            ]);
        },
        // close dialog
        close() {
            this.resetEventForm();
            this.updateModel(["eventForm.dialog", false]);
        },
        // edit custom plan
        async edit(remove) {
            // start loading
            if (remove) this.removeLoading = true;
            else this.editLoading = true;
            this.disabled = true;
            // fill the request object
            let reqObj = {
                custom_plan_id: this.eventForm.data.id,
                tree: this.isStudent
                    ? ["groups", "floatingStudents", "plans", "custom_plans"]
                    : [
                          "groups",
                          "courses",
                          "subgroups",
                          "plans",
                          "custom_plans",
                      ],
            };
            if (!remove) {
                const from = `${this.eventForm.form.fromSurahIndex + 1}:${
                        this.eventForm.form.fromAyah
                    }`,
                    to = `${this.eventForm.form.toSurahIndex + 1}:${
                        this.eventForm.form.toAyah
                    }`,
                    date = new Date(this.eventForm.form.date).getTime();
                reqObj.newData = {
                    from,
                    to,
                    date: date + "",
                };
            }
            await this.editCustomPlan(reqObj);
            // close the dialog
            this.close();
            // update the events
            this.update();
            // end loading
            this.removeLoading = false;
            this.editLoading = false;
            this.disabled = false;
        },
        add() {},
    },
};
</script>
