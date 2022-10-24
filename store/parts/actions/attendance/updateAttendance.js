// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
import stringify from "../functions/stringify";
// function
export default async function ({ state, commit }, args) {
    // const subgroup_id = args.subgroup_id,
    //     tree = args.tree;
    // delete args.group_id;
    // delete args.tree;
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    const stringifyArgs = stringify(args);
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`mutation {updateAttendance(${stringifyArgs})}`,
            });
        return data;
    };
    // let data = await request();

    // add optimistic response to the new goal
    const optimistic = new Optimistic({
        state,
        commit,
        request,
        dataKey: "updateAttendance",
    });
    // let tree = ['AttendanceHistory[${}]']
    let index;
    state.AttendanceHistory.some((h, i) => {
        let condition = h.date === args.date;
        if (condition) index = i;
        return condition;
    });
    await optimistic.update({
        id: args.user_id,
        requestData: args,
        tree: [`AttendanceHistory[${index}].students`],
        targetArray: "attendance",
    });
    // }
}
