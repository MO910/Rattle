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
    // courses
    Course_type = require("../Courses/Course"),
    Courses_schema = require("../../../models/Courses/Courses");
// export Type
module.exports = new GraphQLObjectType({
    name: "Group",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        student_ids: { type: GraphQLID },
        goals: {
            type: new GraphQLList(Goal_type),
            async resolve({ id: group_id }) {
                return await Goals_schema.find({
                    group_id,
                });
            },
        },
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
        courses: {
            type: new GraphQLList(Course_type),
            async resolve({ id: group_id }) {
                return await Courses_schema.find({ group_id });
            },
        },
    }),
});
