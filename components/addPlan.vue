<template lang="pug" key="index">
v-dialog(
    v-model='dialog' width="570" :persistent='loading'
)
    template(v-slot:activator='{ on, attrs }')
        v-btn.mx-5(
            color='primary lighten-2'
            v-bind='attrs'
            v-on='on'
            icon
            outlined
        )
            v-icon mdi-plus
    v-card
        v-card-title.text-h5.text-capitalize.d-inline-block {{$vuetify.lang.t('$vuetify.addPlan')}}
        //- pickColor
        v-menu(offset-y)
            template(v-slot:activator='{ on, attrs }')
                v-btn(
                    v-bind='attrs'
                    v-on='on'
                    fab
                    dark
                    x-small
                    :color="selectedColor"
                )
            v-card
                v-card-text
                    v-btn.ma-3(
                        v-for='color in colors'
                        :key='color'
                        :color="color"
                        @click='selectColor(color)'
                        fab
                        dark
                        x-small
                    )
                        v-icon(v-if='color == selectedColor') mdi-check-circle
        //- other fields
        v-card-text
            v-form(:disabled='loading')
                v-row
                    v-col.text-h6(cols='12') {{$vuetify.lang.t('$vuetify.type')}}
                    v-col(cols='12')
                        v-btn-toggle(v-model="type_selected" mandatory group borderless)
                            v-btn.mr-3(v-for='type in types' :key='type') {{$vuetify.lang.t(`$vuetify.${type}`)}}
                v-row
                    v-col.text-h6(cols='12') {{$vuetify.lang.t('$vuetify.direction')}}
                    v-col(cols='12')
                        v-btn-toggle(v-model="direction_selected" mandatory group borderless)
                            v-btn.mr-3(v-for='direction in directions' :key='direction') {{$vuetify.lang.t(`$vuetify.${direction}`)}}
                v-row
                    v-col(cols='12')
                        v-select(
                            :label="$vuetify.lang.t('$vuetify.surah')"
                            v-model='selectedSurahIndex'
                            :items='surahSearchResults'
                            item-text="name"
                            item-value="index"
                        )
                            template(v-slot:prepend-item)
                                v-list-item
                                    v-text-field.d-block(
                                        v-model="surahSearch"
                                        name="surah"
                                        :label="$vuetify.lang.t('$vuetify.search')"
                                    )
                                v-divider
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | {{$vuetify.lang.t('$vuetify.from')}} {{$vuetify.lang.t('$vuetify.ayah')}}
                    v-col.d-flex.justify-end.align-center(cols='6')
                        inputNumber(
                            model='addPlanForm.ayahValue'
                            key='ayahValue'
                            id_key='ayahValue'
                            :digitWidth='5'
                            :min='1'
                            :max='10'
                            :init='addPlanForm.ayahValue || 1'
                        )
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | {{$vuetify.lang.t('$vuetify.pagesPerDay')}}
                    v-col.d-flex.justify-end.align-center(cols='6')
                        inputNumber(
                            model='addPlanForm.pagesValue'
                            key='pagesValue'
                            id_key='pagesValue'
                            :digitWidth='5'
                            :min='1'
                            :init='addPlanForm.pagesValue || 1'
                        )
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | {{$vuetify.lang.t('$vuetify.weeks')}}: {{weeks}}
                    v-col.d-flex.justify-end.align-center(cols='6')
                        v-slider.align-center(v-model='weeks' :min='min' :max='maxWeeks' hide-details)
                            template(v-slot:thumb-label="props") {{props.value}}
                    v-col(cols='12')
                        v-divider
                    v-col.text-h6(cols='12')
                        v-switch(
                            v-model="has_rabt"
                            :label="$vuetify.lang.t('$vuetify.hasRabt')"
                        )
                v-row(v-if='has_rabt')
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | {{$vuetify.lang.t('$vuetify.rabtPages')}}
                    v-col.d-flex.justify-end.align-center(cols='6')
                        inputNumber(
                            model='addPlanForm.rabtPagesValue'
                            key='rabtPagesValue'
                            id_key='rabtPagesValue'
                            :digitWidth='5'
                            :min='1'
                            :init='addPlanForm.rabtPagesValue || 1'
                        )
                v-row
                    v-col(cols='12')
                        v-divider
                    v-col(cols='12').text-h6.font-weight-regular.text-capitalize
                        | {{$vuetify.lang.t('$vuetify.workingDays')}}
                    v-btn-toggle(v-model="days_selected" mandatory multiple group dense color="cyan darken-3")
                        v-btn.mr-3(v-for='(d, i) in days' :key='i') {{d}}
                    //- date
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        | {{$vuetify.lang.t('$vuetify.startingDate')}}
                    v-col.d-flex.justify-start.align-center.text-h6(cols='6')
                        v-menu(transition='scroll-y-transition' offset-y)
                            template(v-slot:activator='{ on, attrs }')
                                v-btn(v-bind='attrs' v-on='on' text block) {{starting_at}}
                            v-date-picker(v-model='starting_at')
                v-card-actions
                    v-spacer
                    v-btn(
                        color='error' text
                        @click='dialog = false' :disabled='loading'
                    ) {{$vuetify.lang.t('$vuetify.cancel')}}
                    v-btn(
                        color='primary'
                        @click='add' :loading='loading'
                    ) {{$vuetify.lang.t('$vuetify.add')}}
</template>
<script>
import { mapState, mapActions } from "vuex";
import { generatePlanDays } from "~/static/js/generatePlanDays";
export default {
    data: () => ({
        dialog: false,
        loading: false,
        has_rabt: false,
        dateMenu: false,
        selectedSurahIndex: null,
        selectedColor: null,
        surahSearch: "",
        type_selected: 0,
        types: ["new", "old", "tajweed", "tafseer", "custom"],
        colors: [
            "indigo",
            "deep-purple",
            "teal",
            "lime darken-3",
            "red",
            "orange",
            "blue-grey",
            "brown",
            "deep-orange",
        ],
        direction_selected: 0,
        directions: ["descending", "Progressive"],
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
        days_selected: [0],
    }),
    props: ["default_days", "subgroup_id", "group", "isStudent"],
    mounted() {
        this.days_selected = this.default_days;
        this.randomValidColor();
        // console.log(this.surahAdj.chapters);
    },
    computed: {
        ...mapState(["addPlanForm", "surahAdj", "versesPerPage"]),
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
        days() {
            return JSON.parse(this.$vuetify.lang.t("$vuetify.weekDays"));
        },
    },
    methods: {
        ...mapActions(["addPlan"]),
        async add() {
            this.loading = true;
            // get starting page
            let pageNumber;
            const verse = `${this.selectedSurahIndex + 1}:${
                this.addPlanForm.ayahValue
            }`;
            this.versesPerPage.pages.forEach((p, pi) => {
                if (p.some((v) => v.verse_key === verse)) pageNumber = pi;
            });
            // inputted data
            let inputPlanData = {
                group_id: this.group.id,
                subgroup_id: this.subgroup_id,
                title: this.types[this.type_selected],
                order_reversed: !!this.direction_selected,
                from: +pageNumber + 1,
                amount: +this.addPlanForm.pagesValue,
                weeks: +this.weeks,
                rabt_amount: this.has_rabt
                    ? +this.addPlanForm.rabtPagesValue
                    : undefined,
                working_days: this.days_selected,
                starting_at: new Date(this.starting_at),
                tree: this.isStudent
                    ? ["groups", "floatingStudents"]
                    : ["groups", "courses", "subgroups"],
                color: this.selectedColor,
            };
            // spread customs
            let plans = generatePlanDays(
                this.group,
                inputPlanData,
                this.versesPerPage
            );
            // add
            let mainPlan;
            for (let plan of plans)
                mainPlan = await this.addPlan({
                    ...plan,
                    rabt_for_plan_id: mainPlan?.id,
                });
            // close and stop loading
            this.loading = false;
            this.dialog = false;
        },
        // colors
        randomValidColor() {
            this.selectedColor = this.colors[0];
        },
        selectColor(color) {
            this.selectedColor = color;
        },
    },
};
</script>
<style lang="sass" scoped>
.pickColor
    height: 1.3em
    aspect-ratio: 1/1
    background: red
    display: inline-block
    border-radius: 50%
</style>
