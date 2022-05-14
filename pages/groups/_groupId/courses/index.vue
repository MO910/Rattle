<template lang="pug" key="index">
v-container
    .text-h3 المقررات
    v-row.pt-10
        v-col.mb-5.col-lg-4.col-md-6.col-xs-12.col-sm-12(
            cols='12'
            v-for='item in courses'
            :key='item.id'
        )
            v-card.px-10.items(
                :class='item.color'
                rounded :href='courseRouter(item.id)'
                v-ripple="{ class: item.ripple}"
            )
                .card-icon.d-flex.py-4
                    //- include ../../../static/img/quran.pug
                    //- v-icon.mr-5(:color='item.color' large) mdi-{{item.icon}}
                v-card-title.text-capitalize.pt-6 {{$vuetify.lang.t(item.title)}}
                v-card-text(
                    v-for='channel in item.channels'
                    :key='channel.id'
                ) {{channel.title}}
</template>
<script>
import { mapState } from "vuex";
export default {
    middleware: ["fetchGroups"],
    data: () => ({}),
    computed: {
        courses() {
            console.log(this.groups);
            return this.groups?.filter(
                (g) => g.id == this.$route.params.groupId
            )[0]?.courses;
        },
        ...mapState(["groups"]),
    },
    methods: {
        courseRouter(courseId) {
            return `${this.$router.currentRoute.path}/${courseId}`;
        },
    },
};
</script>

<style lang="sass" scoped>
.v-card
    height: 250px
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
</style>
