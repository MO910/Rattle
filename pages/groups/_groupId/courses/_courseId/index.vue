<template lang="pug" key="index">
v-container
    p(
        v-for='adv in goalsFormatted'
        :key='adv.id'
        :id='adv.id'
        v-show='!adv.hide'
    ) {{adv.text}}
    //- @click='removeGoal({id: adv.id})'
    v-dialog(v-model="addDialog.model" width="600")
        v-card
            v-card-title fsafdsa
            v-card-text
                v-container
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
                    v-col(cols='12')
                        .text-h6 {{selectedSurah}} من {{range[0]}} الى {{range[1]}}
                    v-col(cols='12')
                        v-range-slider.align-center(v-model='range' :max='max' :min='min' hide-details)
                            template(v-slot:thumb-label="props")
                                |{{props.value}}
                    v-btn(color='primary' @click='addAGoal') add
    v-btn(@click='addDialog.model = true') add goal
    v-data-table(
        :headers="headers"
        :items="table"
        :items-per-page="itemsPerPage"
        :search="search"
        :single-select='false'
        :page.sync="page"
        item-key="id"
        @page-count="pageCount = $event"
        :show-select='false'
        hide-default-footer
        loading-text="Loading... Please wait"
        color='red'
        class="elevation-1"
    )           
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    middleware: ["fetchGroups"],
    mounted() {
        console.log("groups", this.groups);
        console.log(this.group.students);
    },
    data: () => ({
        page: 1,
        pageCount: 2,
        itemsPerPage: 10,
        search: "",
        headers: [
            { text: "name", value: "name" },
            { text: "Goals", value: "goals" },
        ],
        addDialog: {
            model: false,
            selected: null,
        },
        surahSearch: "",
        totalAyahs: [],
        min: 1,
        max: 90,
        range: [1, 70],
        selectedSurah: "",
    }),
    computed: {
        ...mapState(["groups", "surah", "goals"]),
        group() {
            const { groupId } = this.$route.params;
            const group = this.groups?.filter((g) => g.id == groupId)[0];
            return group;
        },
        table() {
            return this.group.students.map((student) => ({
                name: student.name,
                goals: JSON.stringify(this.goalsFormatted.map((g) => g.text)),
            }));
        },
        surahSearchResults() {
            const searchForReg = new RegExp(
                this.surahSearch.replace(/\s/g, "")
            );
            const cleanReg = new RegExp("[^\u0621-\u063A^\u0641-\u064A]", "g");
            const results = this.surah.data.filter((s) =>
                s.name.replace(cleanReg, "").match(searchForReg)
            );
            return results.map((r) => r.name);
        },
        goalsFormatted() {
            if (!this.group.goals) return;
            let out = [];
            this.group.goals.forEach((goal) => {
                const subgroupPlan = goal;
                // if (!subgroupPlan) return;
                const surah = this.surah.data.filter(
                    (s) => s.englishName == subgroupPlan.chapter
                )[0];
                const { from, to } = subgroupPlan;
                out.push({
                    id: goal?.id,
                    hide: goal.hide,
                    text: `${surah?.name}  من آية ${from} الى آاية ${to}`,
                });
            });
            return out;
        },
    },
    methods: {
        ...mapActions(["addGoal", "removeGoal"]),
        async addAGoal() {
            const chapter = this.surah.data.filter(
                (s) => s.name == this.selectedSurah
            )[0]?.englishName;
            const [from, to] = this.range;
            await this.addGoal({
                group_id: this.$route.params.groupId,
                chapter,
                from,
                to,
            });
            this.addDialog.model = false;
        },
    },
};
</script>

<style lang="sass">
.items
    padding-bottom: 4em
    border-radius: 10px !important
    box-shadow: 0px 0px 34px -20px rgb(0 0 0 / 50%) !important
    .card-icon > svg
        margin: auto
    .v-card__title
        font-size: clamp(2rem, 3vw, 2.5rem) !important
    &.items
        .v-card__title
            font-size: clamp(2rem, 3vw, 2.5rem) !important
    .v-card__text
        font-size: 1.2rem !important
.folder .folderTitle
    font-size: 1.5em !important
.col
    position: relative
</style>
