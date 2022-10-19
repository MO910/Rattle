const {
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean,
    GraphQLList,
} = require("graphql");
const //subgroup
    Subgroups_Schema = require("../../../models/Groups/Subgroups"),
    Subgroup_type = require("../../types/Groups/Subgroup"),
    //course
    Courses_Schema = require("../../../models/Courses/Courses"),
    //group
    Groups_Schema = require("../../../models/Groups/Groups"),
    // user
    Users_Schema = require("../../../models/Users/Users");
// Subgroup_type = require("../../types/Groups/Subgroup");
// Function
module.exports = {
    type: GraphQLBoolean,
    args: {
        student_id: { type: GraphQLID },
        subgroup_id: { type: GraphQLID },
        course_id: { type: GraphQLID },
    },
    async resolve(_, { student_id, subgroup_id, course_id }) {
        try {
            // remove from floating student
            await Users_Schema.findByIdAndUpdate(student_id, {
                $unset: { group_id: "" },
            });
            // remove from any subgroup
            await Subgroups_Schema.updateMany(
                { course_id },
                {
                    $pullAll: { student_ids: student_id },
                }
            );
            // push to subgroup
            await Subgroups_Schema.findByIdAndUpdate(subgroup_id, {
                $push: { student_ids: student_id },
            });
        } catch (err) {}
        return true;
    },
};
