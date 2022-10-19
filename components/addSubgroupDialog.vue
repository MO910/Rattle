<template lang="pug">
v-dialog.addCenterDialog(v-model='addSubgroupForm.dialog' persistent max-width='600px')
    v-card
        v-card-title
            .text-h4.text-capitalize {{$vuetify.lang.t("$vuetify.newCenter")}}
        v-card-text
            v-container
                v-row 
                    v-col(cols='12')
                        v-text-field(
                            v-model='title'
                            name="name"
                            autocomplete="name"
                            :label="$vuetify.lang.t('$vuetify.name')"
                        )
        v-card-actions
            v-spacer
            v-btn(color='blue darken-1' text @click='close')
                | {{$vuetify.lang.t("$vuetify.cancel")}}
            v-btn(color='blue darken-1' text @click='add' :loading='loading')
                | {{$vuetify.lang.t("$vuetify.add")}}
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    props: ["course_id"],
    data: () => ({
        title: "",
        working_days: [0, 1, 2, 3, 4],
        description: "",
        loading: false,
    }),
    computed: {
        ...mapState(["addSubgroupForm"]),
    },
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["createSubgroup"]),
        close() {
            this.updateModel(["addSubgroupForm.dialog", false]);
        },
        async add() {
            this.loading = true;
            await this.createSubgroup({
                title: this.title,
                course_id: this.course_id,
            });
            this.loading = false;
            this.close();
        },
    },
};
</script>
