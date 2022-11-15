// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
import stringify from "../functions/stringify";
// function
export default async function ({ state, commit }, args) {
    const subgroup_id = args.subgroup_id,
        tree = args.tree,
        custom_plans = args.days;
    delete args.days;
    delete args.group_id;
    delete args.tree;
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    const stringifyArgs = stringify(args);
    // * add the plan request
    // GraphQl request
    const addPlanRequest = async () => {
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
    // add optimistic response to the new goal
    const addPlanOptimistic = new Optimistic({
        state,
        commit,
        request: addPlanRequest,
        dataKey: "addPlan",
    });
    console.log(tree);
    const newPlan = await addPlanOptimistic.add({
        id: subgroup_id,
        requestData: { custom_plans: [], ...args },
        tree,
        targetArray: "plans",
    });
    // *spread request
    const spreadRequest = async () => {
        const spreadArgs = stringify(
            {
                plan_id: newPlan.id,
                custom_plans,
            },
            true
        );
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation {
                        spreadPlan(${spreadArgs}) {
                            id
                            date
                            from
                            to
                            note
                        }
                    }
                `,
            });
        return data;
    };
    // add optimistic response to the new goal
    const spreadOptimistic = new Optimistic({
        state,
        commit,
        request: spreadRequest,
        dataKey: "spreadPlan",
    });
    const customs = await spreadOptimistic.add({
        id: newPlan.id,
        requestData: custom_plans,
        tree: [...tree, "plans"],
        targetArray: "custom_plans",
    });
    // return the plan
    return newPlan;
    // }
}
