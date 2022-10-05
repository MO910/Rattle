const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
// User Type
module.exports = new GraphQLObjectType({
    name: "Attendance",
    fields: () => ({
        id: { type: GraphQLID },
        updated_by: { type: GraphQLID },
        attended: { type: GraphQLBoolean },
        date: { type: GraphQLString },
        note: { type: GraphQLString },
    }),
});
