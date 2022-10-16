<template lang="pug" key="index">
    v-data-table(
        :headers="headers"
        :items="plansToTables"
        :items-per-page="10"
        class="elevation-1"
    )
        //- days in english
        template(v-slot:item.sunday="{ item }")
            tableD(:item='item' day='sunday')
        template(v-slot:item.monday="{ item }")
            tableD(:item='item' day='monday')
        template(v-slot:item.tuesday="{ item }")
            tableD(:item='item' day='tuesday')
        template(v-slot:item.wednesday="{ item }")
            tableD(:item='item' day='wednesday')
        template(v-slot:item.thursday="{ item }")
            tableD(:item='item' day='thursday')
        template(v-slot:item.friday="{ item }")
            tableD(:item='item' day='friday')
        template(v-slot:item.saturday="{ item }")
            tableD(:item='item' day='saturday')
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
    mounted() {},
    computed: {
        headers() {
            const weekDaysLang = JSON.parse(
                this.$vuetify.lang.t("$vuetify.weekDays")
            );
            return this.weekDays.reduce((acc, curr, i) => {
                const currLang = weekDaysLang[i];
                acc.push({
                    text: currLang[0].toUpperCase() + currLang.slice(1),
                    value: curr,
                    sortable: false,
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
            return chip?.[0];
        },
        rest(item, head) {
            return (
                "\n" +
                item[head].replace(this.regExpReplace, "").replace(/<|>/g, "")
            );
        },
    },
};
</script>
<style lang="sass">
tableD
    white-space: break-spaces
</style>
