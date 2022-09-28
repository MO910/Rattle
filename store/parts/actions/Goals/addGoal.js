// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
// function
export default async function (
    { state, commit },
    { group_id, chapter, from, to, due, note }
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
                            group_id: "${group_id}"
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
    let data = await request();
    console.log(data);
    // add optimistic response to the new goal
    const optimistic = new Optimistic({
        state,
        commit,
        request,
        dataKey: "addGoal",
    });
    optimistic.add({
        id: group_id,
        requestData: {
            group_id,
            chapter,
            from,
            to,
        },
        tree: ["groups", "courses", "channels", "subgroups"],
        targetArray: "goals",
    });
    // }
}
