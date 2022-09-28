const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
//
const User_type = require("../Users/User"),
    Users_schema = require("../../../models/Users/Users"),
    //
    Goal_type = require("../Goals/Goal"),
    Goals_schema = require("../../../models/Courses/Goals/Goals");
// export Type
// User Type
module.exports = new GraphQLObjectType({
    name: "Subgroup",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        // goals: {
        //     type: new GraphQLList(Goal_type),
        //     async resolve({ id: subgroup_id }) {
        //         return await Goals_schema.find({
        //             subgroup_id,
        //         });
        //     },
        // },
        students: {
            type: new GraphQLList(User_type),
            async resolve({ student_ids }) {
                const students = await Promise.all(
                    student_ids.map(async (studentId) => {
                        return await Users_schema.findById(studentId);
                    })
                );
                return students;
            },
        },
    }),
});
