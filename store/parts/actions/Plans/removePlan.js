// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
// function
export default async function ({ state, commit }, force) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const id = state.confirmRemovingPlan.planId;
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation {
                        removePlan(
                            id: "${id}"
                            force: ${!!force}
                        ) {
                            hasRemoved
                            customsRemainingId 
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
        dataKey: "removePlan",
    });
    // callback before actually removing the subgroup
    const callbackAfter = (findItemPath, element, response, i = 0) => {
        console.log({ findItemPath, element, response, i });
        if (!response[i]) return;
        if (!force && !response[i].hasRemoved) {
            const ids = response[i]?.customsRemainingId;
            let customsRemaining = element.custom_plans.filter((custom) =>
                ids.includes(custom.id)
            );
            // add back the customs that remaining
            commit("updateModel", [
                `${findItemPath}.custom_plans`,
                customsRemaining,
            ]);
            // story the response
            commit("updateModel", ["confirmRemovingPlan.response", response]);
            // throw an error to stop the sequence
            throw "error";
        }
        // clear the response
        else if (i == 1) {
            const regexp = new RegExp(/\[(\d+)\]$/);
            let index = findItemPath.match(regexp);
            let list = findItemPath.replace(regexp, "");
            console.log({ list, index });
            commit("remove", [list, +index[1]]);
        }
    };
    // remove
    const [path, __, response] = await optimistic.remove({
        id,
        checkHide: true,
        callbackAfter,
        tree: ["groups", "courses", "subgroups", "plans"],
    });
    // remove rabt plan
    const allPlansList = eval(`state.${path}`);
    let rabtPlanIndex = allPlansList.reduce((acc, plan, i) => {
        if (!plan.hide && plan.rabt_for_plan_id === id) return i;
        return acc;
    }, null);
    try {
        callbackAfter(
            `${path}[${rabtPlanIndex}]`,
            allPlansList[rabtPlanIndex],
            response,
            1
        );
    } catch (err) {
        console.log(err);
    }
}
