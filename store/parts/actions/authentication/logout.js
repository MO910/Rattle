export default function ({ state, commit }) {
    this.$auth.logout();
    // delete user data
    commit("updateModel", ["user", {}]);
    // redirect
    this.$router.push("/signin");
}
