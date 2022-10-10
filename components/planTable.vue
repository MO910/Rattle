<template lang="pug" key="index">
    v-data-table(
        :headers="headers"
        :items="plansToTables"
        :items-per-page="10"
        class="elevation-1"
    )
        template(v-slot:item.الاحد="{ item }")
            tableD(:item='item' day='الاحد')
        template(v-slot:item.الاثنين="{ item }")
            tableD(:item='item' day='الاثنين')
        template(v-slot:item.الثلاثاء="{ item }")
            tableD(:item='item' day='الثلاثاء')
        template(v-slot:item.الاربعاء="{ item }")
            tableD(:item='item' day='الاربعاء')
        template(v-slot:item.الخميس="{ item }")
            tableD(:item='item' day='الخميس')
        template(v-slot:item.الجمعة="{ item }")
            tableD(:item='item' day='الجمعة')
        template(v-slot:item.السبت="{ item }")
            tableD(:item='item' day='السبت')
</template>
<script>
import { mapState, mapActions } from "vuex";
import { planTable } from "~/static/js/planTable";
export default {
    props: ["plansToTables", "weekDays"],
    data: () => ({
        regExp: new RegExp("(?<=<p>).+(?=<\/p>)", "g"),
        regExpReplace: new RegExp("<p>.+<\/p>", "g"),
        color: "primary",
    }),
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
    methods: {
        getChip(item, head) {
            let chip = item[head].match(this.regExp);
            console.log(item[head.text]);
            return chip?.[0];
        },
        rest(item, head) {
            console.log(item[head]);
            return (
                "\n" +
                item[head].replace(this.regExpReplace, "").replace(/<|>/g, "")
            );
        },
        slot(head) {
            let obj = {};
            obj[`v-slot:item.${head}`] = "{ item }";
            console.log(obj);
            return obj;
        },
    },
};
</script>
<style lang="sass">
tableD
    white-space: break-spaces
</style>
