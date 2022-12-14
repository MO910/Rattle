// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
import transportToSubgroup from "./transportToSubgroup";
// function
export default async function ({ state, commit, dispatch }, { id, course_id }) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation {
                        removeSubgroup(id: "${id}"){
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
    // console.log(data);
    // add optimistic response to the new goal
    const optimistic = new Optimistic({
        state,
        commit,
        dispatch,
        request,
        dataKey: "removeSubgroup",
    });
    // callback before actually removing the subgroup
    const callbackBefore = async (element) => {
        await Promise.all(
            element.students?.map(async (student) => {
                await dispatch("transportToSubgroup", {
                    student_id: student.id,
                    course_id,
                });
            })
        );
    };
    // remove
    await optimistic.remove({
        id,
        tree: ["groups", "courses", "subgroups"],
        callbackBefore,
    });
}
