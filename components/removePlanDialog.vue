<template lang="pug" key="index">
v-dialog(
    :value='confirmRemovingPlan.dialog' @input='close'
    width="570" :persistent='loading'
)
    v-card
        v-card-title.text-h5.text-capitalize.d-inline-block
            span {{$vuetify.lang.t('$vuetify.removePlan')}}
        //- other fields
        v-card-text
            v-row
                //- v-col(cols=12) are you sure you want to remove #[span ] plan
                v-col(cols=12 v-if='!confirmRemovingPlan.response')
                    span {{$vuetify.lang.t('$vuetify.confirmRemoveMsg')}}
                v-col(cols=12 v-else-if='isAllRemoved')
                    span {{$vuetify.lang.t('$vuetify.hasRemovedMsg')}}
                template(v-else)
                    v-col(cols=12) {{$vuetify.lang.t('$vuetify.someCustomsRemainingMsg')}}
                    v-col.px-10(cols=12)
                        ul
                            li(v-for='custom in mapCustoms')
                                | {{custom}}
                    v-col(cols=12) {{$vuetify.lang.t('$vuetify.confirmForceRemoveMsg')}}
        v-card-actions
            v-spacer
            v-btn(
                v-if='confirmRemovingPlan.response'
                color='error' text
                @click='remove(true)'
                :loading='loading'
            ) {{$vuetify.lang.t('$vuetify.forceRemove')}}
            v-btn(
                v-else
                color='error' text
                @click='remove(false)'
                :loading='loading'
            ) {{$vuetify.lang.t('$vuetify.remove')}}
            v-btn(color='primary' @click='close' :disabled='loading') {{$vuetify.lang.t('$vuetify.cancel')}}
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { stringify } from "~/static/js/stringify";
export default {
    data: () => ({
        loading: false,
    }),
    props: ["plans"],
    mounted() {},
    computed: {
        ...mapState(["confirmRemovingPlan", "versesPerPage", "surahAdj"]),
        mapCustoms() {
            let ids = this.confirmRemovingPlan.response;
            ids = ids?.map((res) => res?.customsRemainingId)?.flat();
            if (!ids) return [];
            const customs = this.plans.map((plan) => plan.custom_plans).flat();
            let intersect = customs.filter((custom) => ids.includes(custom.id));
            intersect = intersect.slice(0, 3);
            return intersect.map((custom) =>
                stringify({
                    day: custom,
                    courseTitle: "quran",
                    versesPerPage: this.versesPerPage,
                    surahAdj: this.surahAdj,
                    $vuetify: this.$vuetify,
                })
            );
        },
        isAllRemoved() {
            return this.confirmRemovingPlan.response
                ?.map((res) => res.hasRemoved)
                ?.every((removed) => removed);
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["removePlan"]),
        async remove(force) {
            this.loading = true;
            await this.removePlan(force);
            this.loading = false;
            // close the dialog if all done
            if (
                force ||
                this.isAllRemoved ||
                !this.confirmRemovingPlan.response
            )
                this.close();
        },
        close(value) {
            console.log("close", value);
            this.updateModel(["confirmRemovingPlan.dialog", false]);
            this.updateModel(["confirmRemovingPlan.planId", null]);
            this.updateModel(["confirmRemovingPlan.response", null]);
        },
    },
};
</script>
<style lang="sass" scoped>
ul
    list-style-position: inside
</style>
