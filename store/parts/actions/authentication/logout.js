export default function ({ state, commit }) {
    this.$auth.logout();
    // redirect
    this.$router.push("/login");
    // delete user data
    commit("updateModel", ["user", {}]);
    // reset all states
    commit("updateModel", ["users", []]);
    commit("updateModel", ["groups", null]);
    commit("updateModel", ["plans", []]);
    commit("updateModel", ["plansToTables", []]);
}
