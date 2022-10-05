export default async ({ $auth, store, redirect }) => {
    if (!$auth.$state.loggedIn || !$auth.$state.user) redirect("/login");
    else await store.dispatch("getGroups");
};
