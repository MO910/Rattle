// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
import stringify from "../functions/stringify";
// function
export default async function ({ state, commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    const { treeFrom, treeTo, isFloating } = args;
    delete args.treeFrom;
    delete args.treeTo;
    delete args.isFloating;
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
    // add optimistic response
    const optimistic = new Optimistic({
        state,
        commit,
        request,
        dataKey: "transportToSubgroup",
    });
    // transport (remove then add)
    await optimistic.transport({
        removeId: args.student_id,
        addId: args.subgroup_id || args.course_id,
        treeFrom,
        treeTo,
    });
}
