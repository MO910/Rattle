// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ commit }, { user_id, goal_id, progress }) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        { data } = await client.mutate({
            mutation: gql`
                mutation {
                    updateGoalsHistory(
                        user_id: "${user_id}"
                        goal_id: "${goal_id}"
                        point: ${progress}
                    )
                }
            `,
        });
    // update store
    // commit("updateModel", ["groups", groups]);
    // }
}
