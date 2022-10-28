<template lang="pug">
v-app(dark)
    navigation-drawer
    v-main
        v-container
            v-btn(v-if="!$auth.loggedIn" nuxt to="/login") login
            v-breadcrumbs(:items="breadcrumbs")
                template(v-slot:divider)
                    v-icon mdi-chevron-{{$vuetify.rtl ? 'left' : 'right'}}
            Nuxt
            contextmenu
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    middleware: ["fillingBreadcrumbs"],
    data: () => ({ items: [] }),
    mounted() {},
    computed: {
        ...mapState(["breadcrumbs"]),
    },
    methods: {
        openMenu() {
            const menu = document.querySelector(".menu");
            menu.classList.add("open");
            this.$vuetify.lang.current = "en";
        },
    },
};
</script>
<style lang="sass">
@import "@/assets/general"
// background noise
#noise
    width: 100vw
    height: 100vh
    background-image: url('http://localhost:3000/img/noise2.png')
    background-repeat: repeat
    pointer-events: none
    // opacity: .7
    z-index: 0
    position: fixed
    &.menu-active
        z-index: 6
.menu
    width: 3vw
    height: 100vh
    margin-right: 2vw
    z-index: 1
    position: fixed
    svg
        width: 100%
        cursor: pointer
    &.open + .v-main .frameContainer
        transform: translateX(-10vw) scale(.85)
        transition: transform .2s ease-in-out

.frameContainer
    width: 90vw
    height: 95vh
    color: black
    border-radius: 1em
    // background: grey
    position: fixed
    top: 2.5vh
    left: 2vw
</style>
