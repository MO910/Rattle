<template lang="pug">
v-container
    v-form(@input="updateModel(['loginForm.valid', $event])")
        v-row
            v-col(cols="12" sm="6")
                v-row.text-h1
                    v-text-field(
                        :value="loginForm.email"
                        @input="updateModel(['loginForm.email', $event])"
                        :rules="[requiredRole]"
                        name="email"
                        autocomplete="email"
                        label="email"
                    )
                v-row
                    v-text-field(
                        :value="loginForm.password"
                        @input="updateModel(['loginForm.password', $event])"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[requiredRole]"
                        :type="showPassword ? 'text' : 'password'"
                        autocomplete="password"
                        name="password"
                        label="password"
                        @click:append="showPassword = !showPassword"
                    )
                v-row
                    v-btn(
                        class="text-capitalize text-start px-10"
                        :loading="loginForm.loading"
                        :disabled="loginForm.loading || (!loginForm.loading && !loginForm.valid)"
                        color="success"
                        @click="login"
                        outlined
                    )
                        | login #[template(v-slot:loader) #[span loging in...]]
                v-row
                    NuxtLink(to="/logup") do you want to create an organization?
                //- Error
                v-row(v-if="loginForm.error")
                    v-alert(dismissible outlined text type="error")
                        | {{ loginForm.error }}
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    data: () => ({
        emailRules: [(v) => /(.+@.+)|SHARK/.test(v) || "E-mail must be valid"],
        showPassword: false,
        requiredRole: (v) => !!v || "this field is required",
    }),
    computed: mapState(["loginForm"]),
    methods: {
        ...mapActions(["login"]),
        ...mapMutations(["updateModel"]),
    },
};
</script>
