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
    name: "output_Custom_Plan",
    fields: () => ({
        id: { type: GraphQLID },
        from: { type: GraphQLInt },
        to: { type: GraphQLInt },

        date: { type: GraphQLString },
        note: { type: GraphQLString },
    }),
});
