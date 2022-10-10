// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
// function
export default async function ({ state, commit }, { id }) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation { removeGoal(id: "${id}") }
                `,
            });
        return data;
    };
    // add optimistic response to the new goal
    const optimistic = new Optimistic({
        state,
        commit,
        request,
        dataKey: "removeGoal",
    });
    optimistic.remove({
        id,
        tree: ["groups", "courses", "channels", "subgroups", "goals"],
    });
    // }
}
