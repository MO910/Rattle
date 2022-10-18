<template lang="pug">
v-dialog(
    :value='editUserForm.dialog'
    @input='changeStatus'
    max-width='600px'
)
    v-card
        v-card-title.text-h4.text-capitalize(v-text='fullName(editUserForm.user)') 
        v-card-text
            v-container
                v-col {{editUserForm.user.first_name}}
        v-card-actions
            v-spacer
            v-btn(color='red darken-1' text @click='close')
                | {{$vuetify.lang.t("$vuetify.cancel")}}
            //- v-btn(color='blue darken-1' text @click='add' :disabled='!valid')
                | {{$vuetify.lang.t("$vuetify.add")}}
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    props: [],
    data: () => ({}),
    computed: {
        ...mapState(["editUserForm"]),
    },
    methods: {
        ...mapMutations(["updateModel"]),
        changeStatus(e) {
            this.updateModel(["editUserForm.dialog", e]);
        },
        close() {
            this.updateModel(["editUserForm.dialog", false]);
        },
        fullName(user) {
            return `${user.first_name} ${user.parent_name || ""}`;
        },
    },
};
</script>
