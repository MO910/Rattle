const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
const timestamps = require("../../shared/timestamps");
// User Type
module.exports = new GraphQLObjectType({
    name: "Advancements_History",
    fields: () => ({
        id: { type: GraphQLID },
        point: { type: GraphQLInt },
        ...timestamps,
    }),
});
