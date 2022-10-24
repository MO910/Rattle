<template lang="pug">
v-container
    v-row.mt-8
        v-col(cols='3' v-for='rule in rules' :key='rule.title')
            folder(:folder='rule' :router='ruleRouter(rule.title)')
</template>

<script>
import { mapState } from "vuex";
export default {
    data: () => ({}),
    async fetch({ $auth, store, redirect }) {
        console.log(!$auth.$state.loggedIn || !$auth.$state.user);
        if (!$auth.$state.loggedIn || !$auth.$state.user)
            return redirect("/login");
        await store.dispatch("getUserData");
    },
    mounted() {
        // console.log("uer", this.user);
    },
    computed: {
        ...mapState(["user"]),
        rules() {
            return this.user?.rules;
        },
    },
    methods: {
        ruleRouter(rule) {
            switch (rule.toLowerCase()) {
                case "teacher":
                    return "/groups";
                    break;
                case "owner":
                    return "/admin";
                    break;
                case "parent":
                    return "/children";
                    break;
                default:
                    return "/";
            }
        },
    },
};
</script>
