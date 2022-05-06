<template lang="pug">
    div
        v-fab-transition(origin='right')
            v-btn.floatingButton.white--text(
                v-show="fab"
                color="cyan darken-3"
                x-large
                fixed
                bottom
                fab
                elevation='0'
            ) #[v-icon mdi-plus]
        //- dialogs
        //- addHabitDialog
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
    data: () => ({
        title: "",
        show: true,
        fab: true,
        // dialog: false,
    }),
    // computed: mapState(["addHabitForm"]),
    props: ["formType"],
    methods: {
        ...mapMutations(["updateModel"]),
    },
};
</script>

<style lang="sass">
.d
    filter: url('#shadowed-goo')
.floatingButton,
.floatingButtonParent .floatingButtonChild
    z-index: 100
    right: 5vw
@for $i from 1 through 3
    .floatingButtonParent .floatingButtonChild:nth-child(#{$i})
        bottom: calc(100px + 50px * #{$i - 1})
.v-overlay--active .v-overlay__scrim
    opacity: 1 !important
    background-color: hsl(0deg 0% 0% / 1%) !important
    backdrop-filter: blur(3px) !important
</style>
