const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
const // Users
    Users_schema = require("../../../models/Users/Users"),
    //Attendance
    Attendance_type = require("./Attendance"),
    Attendances_schema = require("../../../models/Users/Attendances"),
    // rules
    Rule_type = require("./Rule"),
    Rules_schema = require("../../../models/Users/Rules"),
    // Advancements
    Goal_History_type = require("../Goals/History"),
    Goals_schema = require("../../../models/Courses/Goals/Goals"),
    Goals_History_schema = require("../../../models/Courses/Goals/History"),
    // rule convert function
    rulesConverter = require("../../types/shared/rulesConverter");
// User Type
const User_type = new GraphQLObjectType({
    name: `User${~~(Math.random() * 1000)}`,
    fields: () => ({
        id: { type: GraphQLID },
        organization_id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
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
                const subgroup = (
                    await Subgroups_schema.find({ student_ids: id })
                )?.[0];
                const group = await Groups_schema.find({
                    $or: [{ _id: subgroup?.group_id }, { student_ids: id }],
                });
                return group?.[0];
            },
        },
        attendances: {
            type: new GraphQLList(Attendance_type),
            async resolve({ id: user_id }) {
                return await Attendances_schema.find({ user_id });
            },
        },
        goals_history: {
            type: new GraphQLList(Goal_History_type),
            async resolve({ id: user_id }) {
                return await Goals_History_schema.find({ user_id });
            },
        },
        children: {
            type: new GraphQLList(User_type),
            async resolve({ id, rule_ids }) {
                const parentRule = await rulesConverter({ rules: ["parent"] });
                if (!rule_ids?.some((r) => r == parentRule[0])) return;
                return await Users_schema.find({
                    parent_id: id,
                });
            },
        },
    }),
});
// export
module.exports = User_type;
// This is here to prevent circular dependencies problem which will lead to the formation of infinite loop
const // Groups
    Group_type = require("../Groups/Group"),
    Groups_schema = require("../../../models/Groups/Groups"),
    Channels_schema = require("../../../models/Courses/Channels"),
    Courses_schema = require("../../../models/Courses/Courses"),
    Subgroups_schema = require("../../../models/Groups/Subgroups");
