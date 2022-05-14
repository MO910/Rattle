// Dependencies
import gql from "graphql-tag";
// function
export default async function (
    { commit },
    { subgroup_id, chapter, from, to, due, note }
) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        { data } = await client.mutate({
            mutation: gql`
                mutation {
                    addGoal(
                        subgroup_id: "${subgroup_id}"
                        chapter: "${chapter}"
                        from: ${from}
                        to: ${to}
                    ){
                        id
                    }
                }
            `,
        });
    // update store
    // commit("updateModel", ["groups", groups]);
    // }
}
