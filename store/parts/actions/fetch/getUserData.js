// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ state, commit }) {
    if (this.$auth.loggedIn && this.$auth.user && !state.user?.id) {
        const userId = this.$auth.user._id;
        // GraphQl request
        const client = this.app.apolloProvider.defaultClient,
            {
                data: { user },
            } = await client.query({
                query: gql`
                    query user {
                        user(id: "${userId}") {
                            name
                            children {
                                name
                                attendances {
                                    attended
                                }
                                rules {
                                    title
                                }
                            }
                            attendances {
                                attended
                            }
                            rules {
                                title
                            }
                        }
                    }
                `,
            });
        // update store
        commit("updateModel", ["user", user]);
    }
}
