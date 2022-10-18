// Dependencies
import gql from "graphql-tag";
import randomPassword from "../functions/randomPassword";
import Optimistic from "../functions/Optimistic";
import stringify from "../functions/stringify";
// function
export default async function ({ state, commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    const nodePath = args.nodePath,
        rules = [...args.rules];
    args.rules = args.rules.map((rule) => rule.title);
    delete args.nodePath;
    // generate a random password if there is null passed
    args.password = args.password || randomPassword();
    //  stringify
    const sArgs = stringify(args);
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation {
                        createUser(${sArgs}){
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
        dataKey: "createUser",
    });
    optimistic.add({
        requestData: { ...args, rules },
        nodePath,
    });
    // }
}
