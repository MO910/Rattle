<template lang="pug">
v-select(
    :label="label"
    :disabled='disabled'
    :value='value'
    :items='surahSearchResults'
    @change="$nuxt.$emit('change', $event, type)"
    item-text="name"
    item-value="index"
)
    template(v-slot:prepend-item)
        v-list-item
            v-text-field.d-block(
                v-model="surahSearch"
                :name="label"
                :label="$vuetify.lang.t('$vuetify.search')"
            )
        v-divider
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
    async mounted() {},
    data: () => ({
        surahSearch: "",
    }),
    props: ["label", "value", "type", "direction_selected", "disabled"],
    // emits: ["change"],
    computed: {
        ...mapState(["surahsNames", "surahAdj"]),
        // select surah and search
        surahsNames() {
            return this.surahAdj.chapters
                .map((s) => s.name_arabic)
                .reduce((acc, name, index) => {
                    return [...acc, { name, index }];
                }, []);
        },
        surahSearchResults() {
            const searchForReg = new RegExp(
                    this.surahSearch.replace(/\s/g, "")
                ),
                cleanReg = new RegExp("[^\u0621-\u063A^\u0641-\u064A]", "g");
            // get results
            let results = this.surahsNames.filter((s) =>
                s.name.replace(cleanReg, "").match(searchForReg)
            );
            // reversed
            if (this.direction_selected) results = results.reverse();
            return results;
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
    },
};
</script>
<style lang="sass" scoped>
.v-card
    height: 100%
</style>
