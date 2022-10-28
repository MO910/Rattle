// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
import stringify from "../functions/stringify";
// function
export default async function ({ state, commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    const sArgs = stringify(args);
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation {
                        createSubgroup(${sArgs}){
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
                                    amount_done
                                }
                            }
                        }
                    }
                `,
            });
        return data;
    };
    // let data = await request();
    // add optimistic response to the new goal
    const optimistic = new Optimistic({
        state,
        commit,
        request,
        dataKey: "createSubgroup",
    });
    await optimistic.add({
        id: args.course_id,
        requestData: { students: [], plans: [], ...args },
        tree: ["groups", "courses"],
        targetArray: "subgroups",
    });
    // }
}
