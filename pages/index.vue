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
    computed: mapState(["user"]),
    methods: {
        ruleRouter(rule) {
            if (rule == "teacher") return "/groups";
            return "/";
        },
    },
};
</script>
