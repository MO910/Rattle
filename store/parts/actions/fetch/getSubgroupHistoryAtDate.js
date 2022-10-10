// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ state, commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user?.id) {
    // userId = userId || this.$auth.user._id;
    const stringifyArgs = JSON.stringify(args)
        .replace(/"(\w+)"(?=:)/g, "$1")
        .replace(/\{|\}/g, "");
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
                            amount_done
                            grade                            
                        }
                    }
                `,
        });
    // console.log(data);
    // update store
    commit("updateModel", ["selectedDateHistory", subgroupHistoryAtDate]);
    // }
}
