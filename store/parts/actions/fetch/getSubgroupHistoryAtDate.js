// Dependencies
import gql from "graphql-tag";
import stringify from "../functions/stringify";
// function
export default async function ({ state, commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user?.id) {
    // userId = userId || this.$auth.user._id;
    const stringifyArgs = stringify(args);
    // GraphQl request
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        {
            data: { subgroupHistoryAtDate },
        } = await client.query({
            query: gql`
                query user {
                    subgroupHistoryAtDate(${stringifyArgs}) {
                        plan_id
                        student_id
                        date
                        amount_done
                        grade
                    }
                }
            `,
        });
    console.log(stringifyArgs, subgroupHistoryAtDate);
    // console.log(data);
    // update store
    subgroupHistoryAtDate?.forEach((h) => {
        commit("push", ["selectedDateHistory", h]);
    });
    // }
}
