// Dependencies
import gql from "graphql-tag";
import treeFinder from "../functions/treeFinder";
// function
export default async function ({ state, commit }) {
    if (state.groups?.length) return;
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    const userId = this.$auth.user._id;
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        {
            data: { groups },
        } = await client.query({
            query: gql`
                query groups {
                    groups(userId: "${userId}") {
                        id
                        title
                        working_days
                        description
                        courses {
                            id
                            title
                            description
                            floatingStudents {
                                id
                                first_name
                                parent_name
                                email
                                phone
                                gender
                                plans {
                                    id
                                    title
                                    color
                                    order_reversed
                                    from
                                    amount
                                    weeks
                                    rabt_amount
                                    working_days
                                    starting_at
                                    custom_plans {
                                        id
                                        from
                                        to
                                        date
                                    }
                                }
                                plans_history {
                                    custom_plan_id
                                    amount_done
                                    grade
                                }
                            }
                            subgroups {
                                id
                                title
                                plans {
                                    id
                                    title
                                    color
                                    order_reversed
                                    from
                                    amount
                                    weeks
                                    rabt_amount
                                    working_days
                                    starting_at
                                    custom_plans {
                                        id
                                        from
                                        to
                                        date
                                    }
                                }
                                students {
                                    id
                                    first_name
                                    parent_name
                                    email
                                    phone
                                    gender
                                    plans_history {
                                        custom_plan_id
                                        amount_done
                                        grade
                                    }
                                }
                            }
                        }
                    }
                }
            `,
        });
    // console.log(groups);
    // update store
    commit("updateModel", ["groups", groups]);
    // }
}
