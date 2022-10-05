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
    name: "Goals_History",
    fields: () => ({
        id: { type: GraphQLID },
        goal_id: { type: GraphQLID },
        point: { type: GraphQLInt },
        ...timestamps,
    }),
});
