<template lang="pug">
v-container
    v-row.mt-8
        v-col(cols='3' v-for='rule in user.rules' :key='rule.title')
            folder(:folder='rule' :router='ruleRouter(rule.title)')
</template>

<script>
import { mapState } from "vuex";
export default {
    data: () => ({}),
    mounted() {
        console.log(this.user);
    },
    computed: mapState(["user"]),
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
