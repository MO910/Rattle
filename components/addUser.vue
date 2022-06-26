<template lang="pug">
v-dialog.addCenterDialog(v-model='addUserForm.dialog' persistent max-width='600px')
    v-card
        v-card-title
            span.text-h4.text-capitalize {{$vuetify.lang.t("$vuetify.newTeacher")}}
        v-card-text
            v-text-field(
                v-model="email"
                :rules="[requiredRole]"
                name="email"
                autocomplete="email"
                :label="$vuetify.lang.t('$vuetify.email')"
            )
            v-text-field(
                v-model='name'
                :rules="[requiredRole]"
                name="name"
                autocomplete="name"
                :label="$vuetify.lang.t('$vuetify.name')"
            )
            v-text-field(
                v-model='phone'
                name="phone"
                autocomplete="phone"
                :label="$vuetify.lang.t('$vuetify.phone')"
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
        name: "",
        email: "",
        phone: "",
        requiredRole: (v) => !!v || "this field is required",
    }),
    computed: mapState(["addUserForm", "organization"]),
    props: ["newUserRule", "nodePath"],
    methods: {
        ...mapMutations(["updateModel"]),
        ...mapActions(["createUser"]),
        close() {
            this.updateModel(["addUserForm.dialog", false]);
        },
        async add() {
            await this.createUser({
                email: this.email,
                name: this.name,
                phone: this.phone,
                rule: [this.newUserRule],
                nodePath: this.nodePath,
            });
            this.close();
        },
    },
};
</script>
