const {
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean,
} = require("graphql");
const Goal_type = require("../../types/Goals/Goal"),
    Goals_Schema = require("../../../models/Courses/Goals/Goals");
// Function
module.exports = {
    type: Goal_type,
    args: {
        subgroup_id: { type: GraphQLID },
        chapter: { type: GraphQLString },
        from: { type: GraphQLInt },
        to: { type: GraphQLInt },
        date: { type: GraphQLString },
        note: { type: GraphQLString },
    },
    async resolve(_, args) {
        return await Goals_Schema.create(args);
    },
};
