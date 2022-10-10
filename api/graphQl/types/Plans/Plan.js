const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
//
const history_type = require("./Plan_History"),
    history_schema = require("../../../models/Plans/Plan_History");
// User Type
module.exports = new GraphQLObjectType({
    name: "Plans",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        order_reversed: { type: GraphQLBoolean },

        from: { type: GraphQLInt },
        amount: { type: GraphQLInt },
        weeks: { type: GraphQLInt },

        rabt_amount: { type: GraphQLInt },

        working_days: { type: new GraphQLList(GraphQLInt) },
        starting_at: { type: GraphQLString },
        note: { type: GraphQLString },
        history: {
            type: new GraphQLList(history_type),
            // async resolve({ id: plan_id }) {
            //     return await Plan_History.find({ plan_id });
            // },
        },
    }),
});
