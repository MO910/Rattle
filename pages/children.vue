<template lang="pug">
v-container
    v-row.mt-8
        v-col(cols='3' v-for='childe in user.children' :key='childe.id')
            folder(:folder='childe.name' :router='childRouter(childe)')
</template>

<script>
import { mapState } from "vuex";
export default {
    data: () => ({}),
    computed: mapState(["user"]),
    methods: {
        childRouter(child) {
            return `user?id=${child.id}`;
        },
    },
};
</script>
