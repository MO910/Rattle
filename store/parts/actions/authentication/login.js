export default async function ({ state, commit, dispatch }) {
    if (state.loginForm.valid) {
        commit("updateModel", ["loginForm.loading", true]);
        // state.loginForm.loading = true;
        try {
            let { data } = await this.$auth.loginWith("local", {
                data: {
                    username: state.loginForm.email,
                    password: state.loginForm.password,
                },
            });
            if (data.error)
                commit("updateModel", ["loginForm.error", data.error]);
            else commit("updateModel", ["loginForm.error", ""]);
            // fetch data
            await dispatch("getUserData");
            // redirect
            this.$router.push("/");
        } catch (err) {
            commit("updateModel", [
                "loginForm.error",
                "email or password is wrong",
            ]);
        }
        commit("updateModel", ["loginForm.loading", false]);
        // state.loginForm.loading = false;
    }
}
