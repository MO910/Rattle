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
        // console.log(this.item);
    },
    computed: {},
    methods: {
        getChip(item) {
            let chip = item[this.day]?.match(this.regExp);
            return chip?.[0];
        },
        rest(item) {
            return item[this.day]?.replace(this.regExpReplace, "");
        },
    },
};
</script>
<style lang="sass">
td
    white-space: break-spaces
</style>
