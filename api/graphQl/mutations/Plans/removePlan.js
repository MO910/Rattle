const {
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean,
} = require("graphql");
const Custom_Plans_Schema = require("../../../models/Plans/Custom_Plans"),
    Plans_Schema = require("../../../models/Plans/Plans");
// Function
module.exports = {
    type: GraphQLBoolean,
    args: {
        id: { type: GraphQLID },
    },
    async resolve(_, { id: plan_id }) {
        // delete rabt plan
        const rabtPlan = await Plans_Schema.findOneAndDelete({
            rabt_for_plan_id: plan_id,
        });
        await Custom_Plans_Schema.deleteMany({ plan_id: rabtPlan?.id });
        // delete all custom plans
        await Custom_Plans_Schema.deleteMany({ plan_id });
        return !!(await Plans_Schema.findByIdAndDelete(plan_id));
    },
};
