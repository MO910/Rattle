// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    const stringifyArgs = JSON.stringify(args)
        .replace(/"(\w+)"(?=:)/g, "$1")
        .replace(/\{|\}/g, "");
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        { data } = await client.mutate({
            mutation: gql`
                mutation {
                    updatePlanHistory(${stringifyArgs})
                }
            `,
        });
    // update store
    // commit("updateModel", ["groups", groups]);
    // }
}
