// Dependencies
import gql from "graphql-tag";
import treeFinder from "../functions/treeFinder";
// function
export default async function ({ state, commit }) {
    if (this.$auth.loggedIn && this.$auth.user) {
        const userId = this.$auth.user._id;
        // GraphQl request
        const client = this.app.apolloProvider.defaultClient,
            { data: organization } = await client.query({
                query: gql`
                    query organization {
                        organization(userId: "${userId}") {
                            id
                            title
                            centers {
                                id
                                title
                                working_days
                                admin_ids
                                description
                                groups {
                                    id
                                    title
                                }
                            }
                        }
                    }
                `,
            });
        // update store
        commit("updateModel", ["organization", organization.organization]);
    }
}
