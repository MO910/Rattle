<template lang="pug">
v-app(dark)
    //- v-navigation-drawer(
    //-     v-model="drawer"
    //-     :mini-variant="miniVariant"
    //-     :clipped="clipped"
    //-     fixed
    //-     app
    //- )
        v-list
            v-list-item(
                v-for="(item, i) in items"
                :key="i"
                :to="item.to"
                router
                exact
            )
                v-list-item-action
                    v-icon {{ item.icon }}
                v-list-text lkjfasdlk;j
    v-app-bar(:clipped-left="clipped" fixed app)
        v-app-bar-nav-icon(@click.stop="drawer = !drawer")
        v-btn(icon @click.stop="miniVariant = !miniVariant")
            v-icon mdi-{{`chevron-${miniVariant ? "right" : "left"}`}}
        v-btn(icon @click.stop="clipped = !clipped")
            v-icon mdi-application
        v-btn(icon @click.stop="fixed = !fixed")
            v-icon mdi-minus
        //- sign in
        div(v-if="$auth.loggedIn") {{ $auth.user }}
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
    v-main
        v-container
            Nuxt
    //- script(src="~/js/menu.js")
</template>

<script>
import { mapActions } from "vuex";
export default {
    middleware: ["fetchUser"],
    mounted() {
        // this.socket = this.$nuxtSocket({
        //     channel: "/index",
        // });
        // /* Listen for events: */
        // this.socket.on("someEvent", (msg, cb) => {
        //     /* Handle event */
        // });
    },
    data: () => ({
        clipped: false,
        drawer: true,
        fixed: false,
        items: [
            {
                icon: "mdi-apps",
                title: "Welcome",
                to: "/",
            },
            {
                icon: "mdi-chart-bubble",
                title: "Inspire",
                to: "/inspire",
            },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
    }),
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
