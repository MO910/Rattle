// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ state, commit }, { name, owner_id }) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        { data } = await client.mutate({
            mutation: gql`
                mutation {
                    createOrganization(
                        owner_id: "${owner_id}"
                        name: "${name}"
                    ){
                        id
                    }
                }
            `,
        });
    // }
}
