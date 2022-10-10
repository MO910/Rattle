// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
// function
export default async function ({ state, commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    const stringifyArgs = JSON.stringify(args)
        .replace(/"(\w+)"(?=:)/g, "$1")
        .replace(/\{|\}/g, "");
    console.log(`
        mutation {
            addPlan(${stringifyArgs}){
                id
                title
                from
                amount
                weeks
                rabt_amount
                working_days
                starting_at
            }
        }
    `);
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation {
                        addPlan(${stringifyArgs}){
                            id
                            title
                            from
                            amount
                            weeks
                            rabt_amount
                            working_days
                            starting_at
                        }
                    }
                `,
            });
        return data;
    };
    let data = await request();
    console.log(data);
    // add optimistic response to the new goal
    // const optimistic = new Optimistic({
    //     state,
    //     commit,
    //     request,
    //     dataKey: "addGoal",
    // });
    // optimistic.add({
    //     id: group_id,
    //     requestData: {
    //         group_id,
    //         chapter,
    //         from,
    //         to,
    //     },
    //     tree: ["groups", "courses", "channels", "subgroups"],
    //     targetArray: "goals",
    // });
    // }
}
