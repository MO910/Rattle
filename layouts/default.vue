<template lang="pug">
v-app
    //- noise
    #noise
    .menu.d-flex.align-center(@click='openMenu')
        .icon
            include ../static/img/menu.pug
        .list
            //- .listItem settings
    //- main view
    v-main
        .frameContainer.grey.lighten-1.px-6.py-5
            div(v-if="$auth.loggedIn")
                | {{ $auth.user }}
                v-btn(
                    color="error"
                    outlined
                    small
                    router
                    to="/login"
                    @click="logout()"
                ) logout
                //- notifications list
                //- notificationsCenter
            div(v-else)
                v-btn(color="success" outlined small router to="/login") login
            //- client-only(placeholder="Loading...")
            nuxt
    //- script(src="~/js/menu.js")
</template>

<script>
import { mapActions } from "vuex";
export default {
    middleware: ["fetchUser"],
    data: () => ({}),
    methods: {
        ...mapActions(["logout"]),
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
