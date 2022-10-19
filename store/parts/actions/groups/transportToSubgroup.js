// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
import stringify from "../functions/stringify";
// function
export default async function ({ state, commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    const tree = args.tree;
    delete args.tree;
    const sArgs = stringify(args);
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation {
                        transportToSubgroup(${sArgs})
                    }`,
            });
        return data;
    };
    // let data = await request();
    // console.log(data);
    // add optimistic response to the new goal
    const optimistic = new Optimistic({
        state,
        commit,
        request,
        dataKey: "removeSubgroup",
    });
    console.log();
    await optimistic.remove({
        id: args.student_id,
        tree,
    });
    await optimistic.add({
        id: args.subgroup_id,
        tree: ["groups", "courses", "subgroups"],
        targetArray: "students",
    });
}
