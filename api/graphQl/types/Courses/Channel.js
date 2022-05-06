const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
//
const Subgroup_type = require("../Groups/Subgroup"),
    Subgroups_schema = require("../../../models/Groups/Subgroups");
// User Type
module.exports = new GraphQLObjectType({
    name: "Channel",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        subgroups: {
            type: new GraphQLList(Subgroup_type),
            async resolve({ id: channel_id }) {
                return await Subgroups_schema.find({ channel_id });
            },
        },
    }),
});
