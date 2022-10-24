// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ state, commit }, { id: userId } = {}) {
    // console.log(this.$auth.loggedIn && this.$auth.user && !state.user?.id);
    if (this.$auth.loggedIn && this.$auth.user && !state.user?.id) {
        userId = userId || this.$auth.user._id;
        // console.log("userId", userId);
        // GraphQl request
        const client = this.app.apolloProvider.defaultClient,
            {
                data: { user },
            } = await client.query({
                query: gql`
                    query user {
                        user(id: "${userId}") {
                            id
                            organization_id
                            first_name
                            parent_name
                            email
                            phone
                            gender
                            rules {
                                id
                                title
                                permissions
                            }
                            groups {
                                id
                                title
                                working_days
                                courses {
                                    id
                                    title
                                    subgroups{
                                        id
                                        title
                                    }
                                }
                            }
                            subgroups {
                                id
                                title
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
