export default function ({ state, commit }) {
    this.$auth.logout();
    // redirect
    this.$router.push("/login");
    // delete user data
    commit("updateModel", ["user", {}]);
}
