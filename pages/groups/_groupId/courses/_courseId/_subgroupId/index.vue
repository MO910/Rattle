<template lang="pug" key="index">
    v-container
        v-dialog(v-model="dialog.model" width="500" height='500')
            v-card 
                v-row
                    v-col(cols='3')
                        folder(:folder='dialog.selected' icon='mdi-account')
        v-breadcrumbs(:items="items")
            template(v-slot:divider)
                v-icon mdi-chevron-right
        .text-h3 {{subgroup.title}} > {{courses.channels[0].title}}
        p(v-for='adv in advancementsFormatted' :key='adv') {{adv}}
        .text-h3 الطلاب
        v-row.py-10
            v-col.pa-0(
                v-for='student in subgroup.students' :key='student.id'
                cols='3' @click='openDialog(student)'
            )
                folder(:folder='student' icon='mdi-account')
                progressLine(
                    v-for='adv in advancements'
                    :key='adv.id'
                    :advancement_id='adv.id'
                    :totalAyahs='fillAyahsArray(adv)'
                )
        //- floatingButton
</template>
<script>
import { mapState } from "vuex";
export default {
    middleware: ["fetchGroups"],
    mounted() {},
    data: () => ({
        dialog: {
            model: false,
            selected: null,
        },
        totalAyahs: [],
        items: [
            {
                text: "Dashboard",
                disabled: false,
                href: "breadcrumbs_dashboard",
            },
            {
                text: "Link 1",
                disabled: false,
                href: "breadcrumbs_link_1",
            },
            {
                text: "Link 2",
                disabled: true,
                href: "breadcrumbs_link_2",
            },
        ],
    }),
    computed: {
        subjects() {
            return this.groups?.filter((g) => g.id == this.$route.params.id)[0]
                ?.subjects;
        },
        group() {
            const { groupId } = this.$route.params;
            const group = this.groups?.filter((g) => g.id == groupId)[0];
            return group;
        },
        courses() {
            const { courseId } = this.$route.params;
            const group = this.group;
            const course = group?.courses?.filter((s) => s.id == courseId)[0];
            return course;
        },
        subgroup() {
            const { subgroupId } = this.$route.params;
            const subgroups = this.courses?.channels?.[0]?.subgroups;
            const subgroup = subgroups?.filter((s) => s.id == subgroupId)[0];
            return subgroup;
        },
        advancements() {
            let adv = this.subgroup?.students?.[0]?.advancements;
            adv[0].current = adv?.[0]?.history?.[adv.length - 1]?.point;
            adv[0].current = adv.current?.replace(/\D/g, "");
            return adv;
        },
        advancementsFormatted() {
            if (!this.advancements) return;
            let out = [];
            this.advancements.forEach((advancement) => {
                const subgroupPlan = this.advancements?.[0];
                if (!subgroupPlan) return;
                const surah = this.surah.data.filter(
                    (s) => s.englishName == subgroupPlan.chapter
                )[0];
                const { from, to } = subgroupPlan;
                out.push(`${surah?.name}  من آية ${from} الى آاية ${to}`);
            });
            return out;
        },
        ...mapState(["groups", "surah"]),
    },
    methods: {
        subgroupRouter(subgroupId) {
            return `${this.$router.currentRoute.path}/${subgroupId}`;
        },
        openDialog(selected) {
            this.dialog.model = true;
            this.dialog.selected = selected;
        },
        fillAyahsArray(adv) {
            let ayahsList = [];
            let range = { from: {}, to: {} };
            range.from.englishName = range.to.englishName = adv.chapter;
            range.from.numberOfAyahs = adv.from;
            range.to.numberOfAyahs = adv.to;
            // filter surahs
            let filterFrom = this.surah.data.filter((SDB) =>
                SDB.englishName.match(range.from.englishName)
            );
            let filterTo = this.surah.data.filter((SDB) =>
                SDB.englishName.match(range.to.englishName)
            );
            // add from ayahs
            let sameSurah = range.from.englishName == range.to.englishName;
            let fromLim = sameSurah
                ? range.to.numberOfAyahs
                : filterFrom[0].numberOfAyahs;
            for (let i = range.from.numberOfAyahs; i <= fromLim; i++)
                ayahsList.push({ surah: range.from.englishName, ayah: i });
            // function to add from beginning of surah
            const addSurahs = (surah) => {
                if (sameSurah) return;
                for (let i = 1; i <= surah.numberOfAyahs; i++) {
                    ayahsList.push({ surah: surah.englishName, ayah: i });
                }
            };
            // sum 'middle' surahs
            let direction = Math.sign(
                filterTo[0].number - filterFrom[0].number
            );
            for (let i = filterFrom[0].number + direction; ; i += direction) {
                // break conditions
                let directionCondition =
                    direction > 0
                        ? i < filterTo[0].number
                        : i > filterTo[0].number;
                if (!directionCondition || sameSurah) break;
                //
                let middleSurah = this.surah.data[i - 1];
                addSurahs(middleSurah);
            }
            // add 'to' ayahs
            addSurahs(range.to);
            //
            const historyProgress = adv.history.reduce((acc, current) => {
                return acc + current.point;
            }, 0);
            // return
            return {
                ayahsList,
                current: {
                    surah: adv.chapter,
                    ayah: adv.from + historyProgress,
                },
            };
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
