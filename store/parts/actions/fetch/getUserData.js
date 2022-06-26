// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ state, commit }, { id: userId } = {}) {
    if (this.$auth.loggedIn && this.$auth.user && !state.user?.id) {
        userId ||= this.$auth.user._id;
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
                            children {
                                id
                                name
                                attendances {
                                    attended
                                }
                                rules {
                                    title
                                    permissions
                                }
                            }
                            attendances {
                                attended
                            }
                            rules {
                                title
                                permissions
                            }
                            goals_history {
                                id
                                goal_id
                                point
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
