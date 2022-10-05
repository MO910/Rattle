const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
//
const subgroup_type = require("./Subgroup"),
    subgroups_schema = require("../../../models/Groups/Subgroups");
// User Type
module.exports = new GraphQLObjectType({
    name: "Course",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        subgroups: {
            type: new GraphQLList(subgroup_type),
            async resolve({ id: course_id }) {
                return await subgroups_schema.find({
                    course_id,
                });
            },
        },
    }),
});
