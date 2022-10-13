// Dependencies
import gql from "graphql-tag";
import randomPassword from "../functions/randomPassword";
import Optimistic from "../functions/Optimistic";
import stringify from "../functions/stringify";
// function
export default async function ({ state, commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // const nodePath = args.nodePath;
    //  stringify
    const sArgs = stringify(args);
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation {
                        updateUser(${sArgs}){
                            id
                        }
                    }
                `,
            });
        return data;
    };
    await request();
    // console.log(data)
    // add optimistic response to the new goal
    // const optimistic = new Optimistic({
    //     state,
    //     commit,
    //     request,
    //     dataKey: "updateUser",
    // });
    // optimistic.add({
    //     requestData: args,
    //     nodePath,
    // });
    // }
}
