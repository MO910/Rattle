<template lang="pug">
div
    //- list
    v-menu(
        :value='contextmenu.show'
        :position-x="contextmenu.x"
        :position-y="contextmenu.y"
        absolute
        offset-y
    )
        v-list(width='200')
            v-list-item(
                v-for='item in contextmenuList' :key='item.title'
                @click='openDialog(item.title)'
                :class='`${item.color}--text`'
                
            )
                v-list-item-icon
                    v-icon(:class='`${item.color}--text`') {{item.icon}}
                v-list-item-title {{$vuetify.lang.t(`$vuetify.${item.title}`)}}
    //- dialog
        @input='contextmenu.dialog.show'
    v-dialog(
        :value='contextmenu.dialog.show'
        width='500'
    )
        //- Transport
        v-card
            v-card-title {{cardTitle}}
            v-card-text(v-if='contextmenu.dialog.type == "transport"')
                v-list(dense)
                    v-list-item-group(v-model='selectedSubgroup' color='primary')
                        v-list-item(v-for='subgroup, i in contextmenu.subgroups' :key='i')
                            v-list-item-icon
                                v-icon f
                            v-list-item-content
                                v-list-item-title {{subgroup.title}}
            v-card-actions
                v-spacer
                v-btn(color='error' text @click='close') cancel
                v-btn(color='primary' @click='action' :loading='loading') {{contextmenu.dialog.type}}
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    mounted() {
        this.selectedSubgroup = 0;
    },
    data: () => ({
        selectedSubgroup: null,
        selectedSubgroup: null,
        loading: false,
    }),
    computed: {
        ...mapState(["contextmenu"]),
        transportTitle() {
            const transport = this.$vuetify.lang.t(`$vuetify.transport`),
                to = this.$vuetify.lang.t(`$vuetify.to`);
            return `${transport} ${this.fullName(
                this.contextmenu.entity
            )} ${to}`;
        },
        confirmationMessage() {
            return `are you sure you want to remove ${this.contextmenu.entity.title} subgroup`;
        },
        contextmenuList() {
            if (this.contextmenu.type === "subgroup")
                return [
                    { title: "edit", icon: "mdi-pencil" },
                    {
                        title: "remove",
                        icon: "mdi-trash-can-outline",
                        color: "red",
                    },
                ];
            else if (this.contextmenu.type.match(/student/gi))
                return [{ title: "transport", icon: "mdi-arrow-decision" }];
            return [];
        },
        cardTitle() {
            if (this.contextmenu.dialog.type === "transport")
                return this.transportTitle;
            else if (this.contextmenu.dialog.type === "remove")
                return this.confirmationMessage;
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["removeSubgroup", "transportToSubgroup"]),
        subgroupRouter(subgroupId) {
            return `${this.$router.currentRoute.path}/${subgroupId}`;
        },
        openDialog(type) {
            this.updateModel(["contextmenu.dialog.show", true]);
            this.updateModel(["contextmenu.dialog.type", type]);
            // this.contextmenu.dialog.show = true;
            // this.contextmenu.dialog.type = type;
        },
        // get full name or title
        fullName(entity) {
            if (entity.first_name)
                return `${entity.first_name} ${entity.parent_name || ""}`;
            return entity.title;
        },
        close() {
            this.updateModel(["contextmenu.dialog.show", false]);
            // this.contextmenu.dialog.show = false;
        },
        icon(item) {},
        async action() {
            const { courseId: course_id } = this.$route.params;
            this.loading = true;
            // do action
            if (this.contextmenu.dialog.type == "remove")
                await this.removeSubgroup({
                    id: this.contextmenu.entity.id,
                    course_id,
                });
            if (this.contextmenu.dialog.type == "transport") {
                const student_id = this.contextmenu.entity.id,
                    subgroup_id =
                        this.contextmenu.subgroups?.[this.selectedSubgroup]?.id,
                    // floating
                    isFloating = this.contextmenu.type === "floatingStudents";
                // do action
                await this.transportToSubgroup({
                    student_id,
                    subgroup_id,
                    course_id,
                    // guid ones
                    isFloating,
                });
            }
            // stop loading and close dialog
            this.loading = false;
            this.close();
        },
    },
};
</script>
<style lang="sass" scoped>
.v-card
    height: 100%
</style>
