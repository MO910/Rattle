<template lang="pug">
div
    v-card(
        :class='entity.color'
        @contextmenu='openContext'
        rounded nuxt :to='subgroupRouter(entity.id)'
    )
        v-app-bar(color="rgba(0, 0, 0, 0)" flat)
            v-btn(icon)
                v-icon mdi-dots-vertical
        v-card-title {{fullName(entity)}}
        v-card-text
            v-chip(
                v-for='chip in chips'
                :key='chip.id'
            ) {{fullName(chip)}}
    //- list
    v-menu(
        v-model='context.show'
        :position-x="context.x"
        :position-y="context.y"
        absolute
        offset-y
    )
        v-list
            v-list-item(v-for='item in list' :key='item' @click='openDialog(item)')
                v-list-item-title {{item}}
    //- dialog
    v-dialog(v-model='dialog.show' width='500')
        //- Transport
        v-card(v-if='dialog.type == "transport"')
            v-card-title {{transportTitle}}
            v-card-text
                v-list(dense)
                    v-list-item-group(v-model='selectedGroup' color='primary')
                        v-list-item(v-for='subgroup in subgroups' :key='subgroup.id')
                            v-list-item-icon
                                v-icon f
                            v-list-item-content
                                v-list-item-title {{subgroup.title}}
            v-card-actions
                v-spacer
                v-btn(color='error' text @click='close') cancel
                v-btn(color='primary' @click='transport' :loading='loading') transport
        //- Remove
        v-card.py-5(v-else-if='dialog.type == "remove"')
            v-card-title {{confirmationMessage}}
            v-card-actions
                v-spacer
                v-btn(color='error' text @click='close') cancel
                v-btn(color='primary' @click='remove' :loading='loading') remove
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    mounted() {
        this.selectedGroup = 0;
    },
    data: () => ({
        context: { show: false },
        dialog: { show: false },
        list: ["transport", "edit", "remove"],
        selectedSubgroup: null,
        selectedGroup: null,
        loading: false,
    }),
    props: ["entity", "chips", "organization", "subgroups"],
    computed: {
        ...mapState(["groups"]),
        transportTitle() {
            const transport = this.$vuetify.lang.t(`$vuetify.transport`),
                to = this.$vuetify.lang.t(`$vuetify.to`);
            return `${transport} ${this.fullName(this.entity)} ${to}`;
        },
        confirmationMessage() {
            return `are you sure you want to remove ${this.entity.title} subgroup`;
        },
    },
    methods: {
        ...mapActions(["removeSubgroup"]),
        subgroupRouter(subgroupId) {
            return `${this.$router.currentRoute.path}/${subgroupId}`;
        },
        openContext(e) {
            e.preventDefault();
            this.context.show = false;
            this.context.x = e.clientX;
            this.context.y = e.clientY;
            this.$nextTick(() => {
                this.context.show = true;
                console.log(this.context);
            });
        },
        openDialog(type) {
            this.dialog.show = true;
            this.dialog.type = type;
        },
        // get full name or title
        fullName(entity) {
            if (entity.first_name)
                return `${entity.first_name} ${entity.parent_name || ""}`;
            return entity.title;
        },
        close() {
            this.dialog.show = false;
        },
        async remove() {
            this.loading = true;
            await this.removeSubgroup(this.entity.id);
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
