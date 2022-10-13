// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ state, commit }) {
    const organization_id = state.organization?.id;
    if (
        this.$auth.loggedIn &&
        this.$auth.user &&
        state.user?.id &&
        organization_id
    ) {
        // GraphQl request
        const client = this.app.apolloProvider.defaultClient,
            {
                data: { user },
            } = await client.query({
                query: gql`
                    query user {
                        user(
                            organization_id: "${organization_id}"
                            rules: ["student"]
                        ) {
                            id
                            organization_id
                            first_name
                            email
                            phone
                            attendances {
                                attended
                            }
                            rules {
                                title
                                permissions
                            }
                            groups {
                                id
                                title
                            }
                            subgroups {
                                id
                                title
                            }
                        }
                    }
                `,
            });
        // update store
        commit("updateModel", ["students", user]);
    }
}
