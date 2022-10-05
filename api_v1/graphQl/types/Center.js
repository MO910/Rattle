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
    name: "Center",
    fields: () => ({
        id: { type: GraphQLID },
        organization_id: { type: GraphQLID },
        admin_id: { type: GraphQLID },
        name: { type: GraphQLString },
    }),
});
