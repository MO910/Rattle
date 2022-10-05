const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
const // shared function
    getGroupFromStudentId = require("../shared/getGroupFromStudentId"),
    // Users
    Users_schema = require("../../../models/Users/Users"),
    //Attendance
    Attendance_type = require("./Attendance"),
    Attendances_schema = require("../../../models/Users/Attendances"),
    // rules
    Rule_type = require("./Rule"),
    Rules_schema = require("../../../models/Users/Rules"),
    // Advancements
    Plan_History_type = require("../Plans/Plan_History"),
    Plans_History_schema = require("../../../models/Plans/Plan_History"),
    // rule convert function
    rulesConverter = require("../shared/rulesConverter");
// User Type
const User_type = new GraphQLObjectType({
    name: `User${~~(Math.random() * 1000)}`,
    fields: () => ({
        id: { type: GraphQLID },
        organization_id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLBoolean },
        phone: { type: GraphQLString },
        rule_ids: { type: new GraphQLList(GraphQLID) },
        rules: {
            type: new GraphQLList(Rule_type),
            async resolve({ rule_ids }) {
                return await rulesConverter({ rule_ids });
            },
        },
        group: {
            type: Group_type,
            async resolve({ id }) {
                return await getGroupFromStudentId(id);
            },
        },
        attendances: {
            type: new GraphQLList(Attendance_type),
            async resolve({ id: user_id }) {
                return await Attendances_schema.find({ user_id });
            },
        },
        plans_history: {
            type: new GraphQLList(Plan_History_type),
            async resolve({ id: student_id }) {
                return await Plans_History_schema.find({ student_id });
            },
        },
        // children: {
        //     type: new GraphQLList(User_type),
        //     async resolve({ id, rule_ids }) {
        //         const parentRule = await rulesConverter({ rules: ["parent"] });
        //         if (!rule_ids?.some((r) => r == parentRule[0])) return;
        //         return await Users_schema.find({
        //             parent_id: id,
        //         });
        //     },
        // },
    }),
});
// export
module.exports = User_type;
// This is here to prevent circular dependencies problem which will lead to the formation of infinite loop
const // Groups
    Group_type = require("../Groups/Group"),
    Groups_schema = require("../../../models/Groups/Groups"),
    Courses_schema = require("../../../models/Courses/Courses"),
    Subgroups_schema = require("../../../models/Groups/Subgroups");
