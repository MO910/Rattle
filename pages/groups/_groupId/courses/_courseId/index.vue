<template lang="pug" key="index">
    v-container
        .text-h3 المجموعات الفرعية
        v-row.pt-10
            v-col(
                cols='12'
                v-for='item in courses.channels[0].subgroups'
                :key='item.id'
            )
                v-card.items.px-10(
                    :class='item.color'
                    rounded router :to='subgroupRouter(item.id)'
                    v-ripple="{ class: item.ripple}"
                )
                    .card-icon.d-flex.py-4
                        //- include ../../../static/img/quran.pug
                        //- v-icon.mr-5(:color='item.color' large) mdi-{{item.icon}}
                    v-card-title.text-capitalize.pt-6 {{$vuetify.lang.t(item.title)}}
                    v-card-text 15 of 20
                    v-row
                        v-col(cols='3' v-for='student in item.students' :key='student.id')
                            folder(:folder='student' icon='mdi-account')
            v-col(cols='3' v-for='student in group.students' :key='student.id')
                folder(:folder='student' icon='mdi-account')
</template>
<script>
import { mapState } from "vuex";
export default {
    middleware: ["fetchGroups"],
    mounted() {},
    data: () => ({}),
    computed: {
        group() {
            const { groupId } = this.$route.params;
            const group = this.groups?.filter((g) => g.id == groupId)?.[0];
            return group;
        },
        courses() {
            const { courseId } = this.$route.params;
            const group = this.group;
            const course = group?.courses?.filter((s) => s.id == courseId)?.[0];

            return course;
        },
        ...mapState(["groups"]),
    },
    methods: {
        subgroupRouter(subgroupId) {
            return `${this.$router.currentRoute.path}/${subgroupId}`;
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
</style>
