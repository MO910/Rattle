<template lang="pug" key="index">
    v-data-table(
        :headers="headers"
        :items="plansToTables[0]"
        :items-per-page="10"
        class="elevation-1"
    )
</template>
<script>
import { mapState, mapActions } from "vuex";
import { planTable } from "~/static/js/planTable";
export default {
    props: ["plansToTables", "weekDays"],
    data: () => ({}),
    mounted() {
        console.log(this.plansToTables);
    },
    computed: {
        headers() {
            return this.weekDays.reduce((acc, curr) => {
                acc.push({
                    text: curr[0].toUpperCase() + curr.slice(1),
                    value: curr,
                });
                return acc;
            }, []);
        },
        groupWorkingDays() {
            return this.group?.working_days;
        },
    },
};
</script>
<style lang="sass" scoped>
td
    white-space: break-spaces
</style>
