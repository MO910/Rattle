const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
const Group_type = require("./Groups/Group"),
    Groups_schema = require("../../models/Groups/Groups");
// User Type
module.exports = new GraphQLObjectType({
    name: "Center",
    fields: () => ({
        id: { type: GraphQLID },
        organization_id: { type: GraphQLID },
        admin_id: { type: GraphQLID },
        title: { type: GraphQLString },
        groups: {
            type: new GraphQLList(Group_type),
            async resolve({ id: center_id }) {
                return await Groups_schema.find({
                    center_id,
                });
            },
        },
    }),
});
