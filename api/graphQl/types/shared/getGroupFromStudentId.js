const Groups_schema = require("../../../models/Groups/Groups"),
    Courses_schema = require("../../../models/Courses/Courses"),
    Subgroups_schema = require("../../../models/Groups/Subgroups");
// getGroupFromStudentId
module.exports = async (id) => {
    // get subgroup
    const subgroup = await Subgroups_schema.find({
        student_ids: id,
    });
    // get course
    const course = await Courses_schema.findById(
        subgroup?.[0]?._doc?.course_id
    );
    // get group
    return await Groups_schema.findById(course?.group_id);
};
