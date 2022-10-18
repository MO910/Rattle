<template lang="pug">
v-dialog.addCenterDialog(v-model='addCenterForm.dialog' persistent max-width='600px')
    v-card
        v-card-title
            span.text-h4.text-capitalize {{$vuetify.lang.t("$vuetify.newCenter")}}
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
                    v-col(cols='12').text-h6.font-weight-regular.text-capitalize
                        | {{$vuetify.lang.t('$vuetify.workingDays')}}
                    v-btn-toggle(v-model="working_days" mandatory multiple group dense color="cyan darken-3")
                        v-btn.mr-3(v-for='(d, i) in days' :key='i') {{d}}
                    v-col.mt-5(cols='12')
                        v-textarea(
                            v-model='description'
                            :label='$vuetify.lang.t("$vuetify.description")' outlined auto-grow
                        )
        v-card-actions
            v-spacer
            v-btn(color='blue darken-1' text @click='close')
                | {{$vuetify.lang.t("$vuetify.cancel")}}
            v-btn(color='blue darken-1' text @click='add')
                | {{$vuetify.lang.t("$vuetify.add")}}
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    // props: ["dialog"],
    data: () => ({
        title: "",
        working_days: [0, 1, 2, 3, 4],
        description: "",
    }),
    computed: {
        ...mapState(["addCenterForm"]),
        days() {
            return JSON.parse(this.$vuetify.lang.t("$vuetify.weekDays"));
        },
    },
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["createCenter"]),
        close() {
            this.updateModel(["addCenterForm.dialog", false]);
        },
        async add() {
            await this.createCenter({
                title: this.title,
                working_days: this.working_days,
                description: this.description,
            });
            this.close();
        },
    },
};
</script>
