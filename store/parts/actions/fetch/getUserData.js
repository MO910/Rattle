// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ state, commit }, { id: userId } = {}) {
    if (this.$auth.loggedIn && this.$auth.user && !state.user?.id) {
        userId = userId || this.$auth.user._id;
        // GraphQl request
        const client = this.app.apolloProvider.defaultClient,
            {
                data: { user },
            } = await client.query({
                query: gql`
                    query user {
                        user(id: "${userId}") {
                            organization_id
                            name
                            email
                            phone
                            gender
                            attendances {
                                attended
                                date
                            }
                            rules {
                                title
                                permissions
                            }
                            group {
                                title
                                working_days
                                courses {
                                    title
                                    subgroups{
                                        title
                                    }
                                }
                            }
                        }
                    }
                `,
            });
        // return the wanted user
        if (this.$auth.user._id !== userId) return user?.[0];
        // update store
        commit("updateModel", ["user", user?.[0]]);
    }
}
