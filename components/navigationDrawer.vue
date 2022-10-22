<template lang="pug">
v-navigation-drawer(
    mini-variant
    mini-variant-width='64'
    :right='$vuetify.lang.current == "ar"'
    app fixed clipped
)
    v-container.py-10.d-flex.flex-column.align-center.justify-space-around
        v-row.d-flex.align-start H
        v-row.d-flex.flex-column.justify-center
            v-tooltip(
                v-for="(item, i) in items" :key="i"
                transition="scroll-x-reverse-transition" left
            )
                template(v-slot:activator="{ on, attrs }")
                    v-btn.pa-6.my-2(
                        :to='item.to' nuxt
                        color='primary' icon
                        v-bind="attrs"
                        v-on="on"
                    ) 
                        v-icon.white--text.text--secondary {{ item.icon }}
                span.text-capitalize {{item.title}}
        v-row.d-flex.align-end(v-if="$auth.loggedIn")
            v-menu(
                transition="scroll-x-reverse-transition"
                :close-on-content-click='false'
                open-on-hover left top offset-x
            )
                template(v-slot:activator="{ on, attrs }")
                    v-avatar(v-bind="attrs" v-on="on" color='teal') M
                v-list(flat)
                    v-list-item.text--secondary(
                        v-for='item, i in list' :key='i'
                        @click="item.action"
                    )
                        v-list-item-icon.ml-3
                            v-icon.text--secondary(small) {{item.icon}}
                        v-list-item-content.d-flex
                            v-list-item-title {{item.title}}
                        v-list-item-action(v-if='item.hasSwitch')
                            v-switch(v-model='item.switch')

</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    // props: ["dialog"],
    data: () => ({
        i: true,
        items: [
            {
                icon: "mdi-home",
                title: "home",
                to: "/",
            },
            {
                icon: "mdi-account-multiple",
                title: "groups",
                to: "/groups",
            },
        ],
    }),
    computed: {
        list() {
            return [
                {
                    title: this.$vuetify.lang.t("$vuetify.settings"),
                    icon: "mdi-cog",
                    to: "/",
                },
                {
                    title: this.$vuetify.lang.t("$vuetify.dark_mode"),
                    icon: "mdi-moon-waning-crescent",
                    hasSwitch: true,
                    switch: true,
                },
                {
                    title: this.$vuetify.lang.t("$vuetify.logout"),
                    icon: "mdi-logout",
                    action: this.logout,
                },
            ];
        },
    },
    methods: {
        ...mapActions(["logout"]),
    },
};
</script>

<style lang="sass" scoped>
.container
    height: 100% !important
.v-navigation-drawer
    width
.v-btn--active .text--secondary
    color: white !important
</style>
