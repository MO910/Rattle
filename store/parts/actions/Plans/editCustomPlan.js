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
    console.log(args);
    const stringifyArgs = stringify(args);
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                mutation {
                    editCustomPlan(${stringifyArgs})
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
        dataKey: "editCustomPlan",
    });
    // let tree = ['AttendanceHistory[${}]']
    if (args.newData) {
        await optimistic.update({
            id: args.custom_plan_id,
            requestData: args.newData,
            tree,
            refresh: true,
        });
    } else {
        await optimistic.remove({
            id: args.custom_plan_id,
            tree,
        });
    }
    // }
}
