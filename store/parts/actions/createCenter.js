// Dependencies
import gql from "graphql-tag";
import Optimistic from "./functions/Optimistic";
import stringify from "./functions/stringify";
// function
export default async function ({ state, commit }, args) {
    const organization_id = state.organization?.id;
    // if (
    //     this.$auth.loggedIn &&
    //     this.$auth.user &&
    //     !state.user.id &&
    //     organization_id
    // ) {
    const sArgs = stringify(args);
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                        mutation {
                            createCenter(
                                organization_id: "${organization_id}"
                                ${sArgs}
                            ){
                                id
                            }
                        }`,
            });
        return data;
    };
    // add optimistic response to the new goal
    const optimistic = new Optimistic({
        state,
        commit,
        request,
        dataKey: "createCenter",
    });
    optimistic.add({
        id: organization_id,
        requestData: {
            organization_id,
            ...args,
        },
        nodePath: "organization",
        targetArray: "centers",
        refresh: "organization",
    });
    // }
}
