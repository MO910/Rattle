const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
// User Type
module.exports = {
    id: { type: GraphQLID },
    from: { type: GraphQLInt },
    to: { type: GraphQLInt },

    date: { type: GraphQLString },
    note: { type: GraphQLString },
};
