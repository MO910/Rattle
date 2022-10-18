<template lang="pug">
v-container
    v-row.mt-8
        v-col(cols='3' v-for='control in controls' :key='control')
            folder(:folder='control' :router='controlRouter(control)')
</template>

<script>
import { mapState } from "vuex";
export default {
    data: () => ({
        controls: ["centers", "groups", "courses", "users"],
    }),
    computed: mapState(["user"]),
    methods: {
        controlRouter(control) {
            const fullPath = this.$router.currentRoute.fullPath.replace(
                /\/$/,
                ""
            );
            // if (control.match(/(teachers)|(students)/g))
            //     control = `users?mode=${control}`;
            return `${fullPath}/${control}`;
        },
    },
};
</script>
