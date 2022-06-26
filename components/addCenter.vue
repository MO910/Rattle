<template lang="pug">
v-dialog.addCenterDialog(v-model='addCenterForm.dialog' persistent max-width='600px')
    v-card
        v-card-title
            span.text-h4.text-capitalize {{$vuetify.lang.t("$vuetify.newCenter")}}
        v-card-text
            v-container
                v-row 
                    v-text-field(
                        v-model='centerName'
                        name="name"
                        autocomplete="name"
                        :label="$vuetify.lang.t('$vuetify.name')"
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
        centerName: "",
    }),
    computed: mapState(["addCenterForm"]),
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["createCenter"]),
        close() {
            this.updateModel(["addCenterForm.dialog", false]);
        },
        async add() {
            await this.createCenter({
                name: this.centerName,
            });
            this.close();
        },
    },
};
</script>
