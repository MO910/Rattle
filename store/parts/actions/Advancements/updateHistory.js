// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ commit }, { advancement_id, progress }) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        { data } = await client.mutate({
            mutation: gql`
                mutation {
                    updateAdvancementsHistory(
                        advancement_id: "${advancement_id}"
                        point: ${progress}
                    )
                }
            `,
        });
    console.log(data);
    // update store
    // commit("updateModel", ["groups", groups]);
    // }
}
