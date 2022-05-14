const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
//
const history_type = require("./History");
history_schema = require("../../../models/Courses/Goals/History");
// User Type
module.exports = new GraphQLObjectType({
    name: "Goals",
    fields: () => ({
        id: { type: GraphQLID },
        chapter: { type: GraphQLString },
        from: { type: GraphQLInt },
        to: { type: GraphQLInt },
        date: { type: GraphQLString },
        note: { type: GraphQLString },
        // history: {
        //     type: new GraphQLList(history_type),
        //     async resolve({ id: goal_id }) {
        //         return await history_schema.find({ goal_id });
        //     },
        // },
    }),
});
