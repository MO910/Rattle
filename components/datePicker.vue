<template lang="pug">
v-dialog(v-model='dialog' width="290px")
    template(v-slot:activator='{ on, attrs }')
        v-btn(
            v-bind='attrs' v-on='on'
            large color='primary'
        )
            v-icon mdi-calendar
            span.mx-3 {{dateStyled}}
        //- v-col.text-h5(cols='12' v-text='dateStyled' v-bind='attrs' v-on='on')
    v-date-picker(
        :value='datePicker.selectedDate'
        @input='getHistory'
        :allowedDates='allowedDates'
        color="primary"
    )
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { extractISODate } from "~/static/js/extractISODate";
export default {
    async mounted() {
        this.selectedSubgroup = 0;
        // set the pointer to todays date
        let today = extractISODate();
        // this.updateModel(["datePicker.selectedDate", today]);
        //
        await this.getHistory(today);
    },
    data: () => ({
        dialog: false,
    }),
    props: ["historyAction", "historyParams", "allowedDates"],
    computed: {
        ...mapState(["datePicker"]),
        dateStyled() {
            // if (!this.plansOfDate.length) return;
            let lang = this.$vuetify.lang.current == "en" ? "en-GB" : "ar-EG";
            const options = { dateStyle: "full" },
                formatter = new Intl.DateTimeFormat(lang, options);
            return formatter.format(new Date(this.datePicker.selectedDate));
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        // get history
        async getHistory(newDate) {
            this.dialog = false;
            this.updateModel(["datePicker.fetching", true]);
            // style the date to from
            this.updateModel(["datePicker.selectedDate", newDate]);
            let date = new Date(newDate).toISOString();
            console.log(date);
            // do action
            console.log(this.historyParams);
            await this.historyAction({
                ...this.historyParams,
                date,
                // date: this.datePicker.selectedDate,
            });
            this.updateModel(["datePicker.fetching", false]);
        },
    },
};
</script>
<style lang="sass" scoped>
.v-card
    height: 100%
</style>
