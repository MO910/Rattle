// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
// function
export default async function (
    { state, commit },
    { subgroup_id, chapter, from, to, due, note }
) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const request = async () => {
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
        return data;
    };
    // add optimistic response to the new goal
    const optimistic = new Optimistic({
        state,
        commit,
        request,
        dataKey: "addGoal",
    });
    optimistic.add({
        id: subgroup_id,
        requestData: {
            subgroup_id,
            chapter,
            from,
            to,
        },
        tree: ["groups", "courses", "channels", "subgroups"],
        targetArray: "goals",
    });
    // }
}
