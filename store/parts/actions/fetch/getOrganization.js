// Dependencies
import gql from "graphql-tag";
import treeFinder from "../functions/treeFinder";
// function
export default async function ({ state, commit }) {
    if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
        const userId = this.$auth.user._id;
        // GraphQl request
        const client = this.app.apolloProvider.defaultClient,
            {
                data: { organization },
            } = await client.query({
                query: gql`
                query organization {
                    organization(userId: "${userId}") {
                        id
                        name
                        centers{
                            id
                            name
                        }
                    }
                }
            `,
            });
        // update store
        commit("updateModel", ["organization", organization]);
    }
}
