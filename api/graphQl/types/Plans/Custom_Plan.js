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
    name: "Custom_Plan",
    fields: () => ({
        id: { type: GraphQLID },
        from: { type: GraphQLInt },
        to: { type: GraphQLInt },

        date: { type: GraphQLString },
        note: { type: GraphQLString },
        // history: {
        // type: new GraphQLList(history_type),
        // async resolve({ id: plan_id }) {
        //     return await Plan_History.find({ plan_id });
        // },
        // },
    }),
});
