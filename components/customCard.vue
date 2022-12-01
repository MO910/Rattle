<template lang="pug">
v-card(
    :class='entity.color'
    @contextmenu='openContext'
    @click='ev'
    rounded nuxt :to='subgroupRouter(entity.id)'
    :loading='loading'
)
    v-app-bar(color="rgba(0, 0, 0, 0)" flat)
        v-btn(icon)
            v-icon mdi-dots-vertical
    v-card-title.text-h5 {{fullName(entity)}}
    //- chips
    v-card-text(v-if='chips')
        v-chip.ma-2(
            v-for='chip, i in chips'
            :key='i'
        ) {{fullName(chip)}}
    //- Advantage
    v-card-text(v-for='plan, i in eachDay' :key='i')
        advantage(
            v-if='!loading && !plan.hide'
            :plan='plan'
            :student_id='entity.id'
            :selectedDate='datePicker.selectedDate'
        )
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
    mounted() {
        // this.selectedSubgroup = 0;
    },
    data: () => ({}),
    props: [
        "entity",
        "chips",
        "organization",
        "subgroups",
        "type",
        "advantage",
        "loading",
        "notRouter",
    ],
    computed: {
        ...mapState(["datePicker"]),
        eachDay() {
            // let advantage = this.advantage.map((plan) => plan.day);
            return (
                this.advantage?.reduce((acc, plan) => {
                    plan.day?.forEach((day) => {
                        acc.push({
                            ...plan,
                            day,
                        });
                    });
                    return acc;
                }, []) || []
            );
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        subgroupRouter(subgroupId) {
            return !this.notRouter
                ? `${this.$router.currentRoute.path}/${subgroupId}`
                : "";
        },
        openContext(e) {
            e.preventDefault();
            this.updateModel(["contextmenu.show", false]);
            this.updateModel(["contextmenu.x", e.clientX]);
            this.updateModel(["contextmenu.y", e.clientY]);
            this.updateModel(["contextmenu.entity", this.entity]);
            this.updateModel(["contextmenu.subgroups", this.subgroups]);
            this.updateModel(["contextmenu.type", this.type]);
            this.$nextTick(() => {
                this.updateModel(["contextmenu.show", true]);
            });
        },
        // get full name or title
        fullName(entity) {
            if (entity?.first_name)
                return `${entity.first_name} ${entity.parent_name || ""}`;
            return entity?.title;
        },
        ev(e) {
            e.preventDefault();
        },
    },
};
</script>
<style lang="sass" scoped>
.v-card
    height: 100%
</style>
