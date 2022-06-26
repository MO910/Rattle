<template lang="pug">
v-container
    h2 {{this.$vuetify.lang.t("$vuetify.creatingOrganization")}}
    v-stepper(v-model='e6' non-linear)
        v-stepper-header
            template(v-for='step, i in steps')
                v-stepper-step.text-capitalize(:complete='e6 > i + 1' :step='i + 1' editable)
                    | {{step}}
                v-divider(v-if='i !== steps.length - 1')
        v-stepper-items
            v-stepper-content(step='1')
                v-text-field(
                    v-model='models.email'
                    name="email"
                    autocomplete="email"
                    :label="$vuetify.lang.t('$vuetify.email')"
                    :rules="[requiredRole]"
                )
                v-text-field(
                    v-model='models.password'
                    name="password"
                    autocomplete="password"
                    :label="$vuetify.lang.t('$vuetify.password')"
                    :rules="[requiredRole]"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                )
                v-text-field(
                    v-model='models.confirmPassword'
                    name="confirmPassword"
                    autocomplete="confirmPassword"
                    :label="$vuetify.lang.t('$vuetify.confirmPassword')"
                    :rules="[requiredRole]"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                )
                v-text-field(
                    v-model='models.name'
                    name="name"
                    autocomplete="name"
                    :label="$vuetify.lang.t('$vuetify.name')"
                    :rules="[requiredRole]"
                )
                v-text-field(
                    v-model='models.phone'
                    name="phone"
                    autocomplete="phone"
                    :label="$vuetify.lang.t('$vuetify.phone')"
                )
                v-btn(color='primary' @click='e6 = 2') Continue
                v-btn(text) Cancel
            v-stepper-content(step='2')
                v-text-field(
                    v-model='models.organizationName'
                    name="organizationName"
                    autocomplete="organizationName"
                    :label="$vuetify.lang.t('$vuetify.organizationName')"
                )
                v-btn(color='primary' @click='create()') create
                v-btn(text) back
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    mounted() {},
    data() {
        return {
            e6: 1,
            steps: [
                this.$vuetify.lang.t("$vuetify.ownerInfo"),
                this.$vuetify.lang.t("$vuetify.organizationInfo"),
            ],
            showPassword: false,
            requiredRole: (v) => !!v || "this field is required",
            models: {
                email: "",
                password: "",
                confirmPassword: "",
                name: "",
                phone: "",
                organizationName: "",
            },
        };
    },
    methods: {
        ...mapActions(["createUser", "createOrganization", "login"]),
        ...mapMutations(["updateModel"]),
        async create() {
            // create the organization
            const organization_id = await this.createOrganization({
                owner_id,
                name: this.models.organizationName,
            });
            // create the owner
            const owner_id = await this.createUser({
                ...this.models,
                organization_id,
                rule: "628631c47ef343cc836be462",
            });
            // set the login form
            this.updateModel(["loginForm.email", this.models.email]);
            this.updateModel(["loginForm.password", this.models.password]);
            this.updateModel(["loginForm.valid", true]);
            // login
            await this.login();
        },
    },
};
</script>
