const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInputObjectType,
} = require("graphql");
// User Type
module.exports = new GraphQLInputObjectType({
    name: "Input_Custom_Plan",
    fields: () => ({
        id: { type: GraphQLID },
        from: { type: GraphQLInt },
        to: { type: GraphQLInt },

        date: { type: GraphQLString },
        note: { type: GraphQLString },
    }),
});
