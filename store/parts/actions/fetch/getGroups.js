// Dependencies
import gql from "graphql-tag";
import treeFinder from "../functions/treeFinder";
// function
export default async function ({ state, commit }) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        {
            data: { groups },
        } = await client.query({
            query: gql`
                query groups {
                    groups(userId: "6336d7f1a99d2cb48dab444a") {
                        id
                        title
                        working_days
                        description
                        courses {
                            id
                            title
                            description
                            subgroups {
                                id
                                title
                                plans {
                                    id
                                    title
                                    order_reversed
                                    from
                                    amount
                                    weeks
                                    rabt_amount
                                    working_days
                                    starting_at
                                }
                                students {
                                    id
                                    first_name
                                    parent_name
                                    email
                                    phone
                                    gender
                                    plans_history {
                                        amount_done
                                    }
                                }
                            }
                        }
                    }
                }
            `,
        });
    // update store
    commit("updateModel", ["groups", groups]);
    // }
}
