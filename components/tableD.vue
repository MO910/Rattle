<template lang="pug" key="index">
div.d-flex.flex-column
    v-chip.my-2.mx-auto(:color='color' small) {{ getChip(item) }}
    div {{rest(item)}}
</template>
<script>
export default {
    props: ["item", "day"],
    data: () => ({
        regExp: new RegExp("(?<=<p>).+(?=<\/p>)", "g"),
        regExpReplace: new RegExp("<p>.+<\/p>", "g"),
        color: "primary",
    }),
    mounted() {
        console.log(this.item, this.day);
    },
    computed: {},
    methods: {
        getChip(item) {
            let chip = item[this.day].match(this.regExp);
            console.log(item[this.day.text]);
            return chip?.[0];
        },
        rest(item) {
            console.log(item[this.day]);
            return item[this.day].replace(this.regExpReplace, "");
        },
    },
};
</script>
<style lang="sass">
td
    white-space: break-spaces
</style>
