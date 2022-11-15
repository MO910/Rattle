// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
// function
export default async function ({ state, commit }, id) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation { removePlan(id: "${id}") }
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
        dataKey: "removePlan",
    });
    const [path] = await optimistic.remove({
        id,
        tree: ["groups", "courses", "subgroups", "plans"],
    });
    // remove rabt plan
    const allPlansList = eval(`state.${path}`);
    let rabtPlanIndex;
    allPlansList.forEach((plan, i) => {
        if (plan.rabt_for_plan_id === id) rabtPlanIndex = i;
    });
    commit("remove", [path, rabtPlanIndex]);
    // }
}
