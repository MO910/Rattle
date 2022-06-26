// Dependencies
import gql from "graphql-tag";
import Optimistic from "./functions/Optimistic";
// function
export default async function ({ state, commit }, { name, admin_id }) {
    const organization_id = state.organization?.id;
    if (
        this.$auth.loggedIn &&
        this.$auth.user &&
        !state.user.id &&
        organization_id
    ) {
        // GraphQl request
        const request = async () => {
            const client = this.app.apolloProvider.defaultClient,
                { data } = await client.mutate({
                    mutation: gql`
                        mutation {
                            createCenter(
                                organization_id: "${organization_id}"
                                ${admin_id ? `admin_id: "${admin_id}"` : ""}
                                name: "${name}"
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
            dataKey: "createCenter",
        });
        optimistic.add({
            id: organization_id,
            requestData: {
                organization_id,
                name,
            },
            nodePath: "organization",
            targetArray: "centers",
            refresh: "organization",
        });
    }
}
