const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
const timestamps = require("../shared/timestamps");
// User Type
module.exports = new GraphQLObjectType({
    name: "Plan_History",
    fields: () => ({
        id: { type: GraphQLID },
        updated_by: { type: GraphQLID },
        student_id: { type: GraphQLID },
        amount_done: { type: GraphQLInt },
        grade: { type: GraphQLInt },

        rabt_amount_done: { type: GraphQLInt },
        rabt_grade: { type: GraphQLInt },

        note: { type: GraphQLString },
        ...timestamps,
    }),
});
