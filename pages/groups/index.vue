<template lang="pug" key="index">
v-container
    v-row.pt-10
        v-col.mb-5.col-lg-4.col-md-6.col-xs-12.col-sm-12(
            cols='12'
            v-for='group in groups'
            :key='group.title'
        )
            v-card.px-10.items(
                :class='group.color'
                rounded router :to='groupRouter(group.id)'
                v-ripple="{ class: group.ripple}"
            )
                .card-icon.d-flex.py-4
                    //- include ../static/img/quran.pug
                    //- v-icon.mr-5(:color='group.color' large) mdi-{{group.icon}}
                v-card-title.text-capitalize.pt-6 {{$vuetify.lang.t(group.title)}}
                v-card-text 15 of 20
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    // middleware: ["fetchGroups"],
    async fetch({ $auth, store, redirect }) {
        if (!$auth.$state.loggedIn || !$auth.$state.user) redirect("/login");
        else await store.dispatch("getGroups");
    },
    mounted() {
        console.log(this.surah);
    },
    data: () => ({}),
    computed: mapState(["groups", "surah"]),
    methods: {
        groupRouter(groupId) {
            return `/groups/${groupId}`;
        },
    },
};
</script>

<style lang="sass" scoped>
.v-card
    height: 250px
    // border-radius: 10px !important
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
