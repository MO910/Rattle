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
    Goals_History_schema = require("../../../models/Courses/Goals/History");
const parentRuleId = "626d35d32e600ed075c196c5";
// User Type
const User_type = new GraphQLObjectType({
    name: `User${~~(Math.random() * 1000)}`,
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        rule_ids: { type: new GraphQLList(GraphQLID) },
        rules: {
            type: new GraphQLList(Rule_type),
            async resolve({ rule_ids }) {
                return await Promise.all(
                    rule_ids.map(async (rule_id) => {
                        return await Rules_schema.findById(rule_id);
                    })
                );
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
            async resolve({ id, rule_ids }, t) {
                console.log(t);
                if (!rule_ids?.some((r) => r == parentRuleId)) return;
                return await Users_schema.find({
                    parent_id: id,
                });
            },
        },
    }),
});
// export
module.exports = User_type;
