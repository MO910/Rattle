const {
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean,
} = require("graphql");
const Centers_Schema = require("../../models/Centers"),
    Center_type = require("../types/Center");
// Function
module.exports = {
    type: Center_type,
    args: {
        organization_id: { type: GraphQLID },
        admin_id: { type: GraphQLID },
        name: { type: GraphQLString },
    },
    async resolve(_, args) {
        return Centers_Schema.create(args);
    },
};
