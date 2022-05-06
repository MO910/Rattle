const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
//
const //Attendance
    Attendance_type = require("./Attendance"),
    Attendances_schema = require("../../../models/Users/Attendances"),
    // rules
    Rule_type = require("./Rule"),
    Group_type = require("../Groups/Group");
//
const User_type = new GraphQLObjectType({
    name: "ser",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        // birth_day: { type: GraphQLInt },
        // gender: { type: GraphQLString },
        // phone: { type: GraphQLString },
        rules: { type: new GraphQLList(Rule_type) },
        // children: { type: new GraphQLList(User_type) },
        // groups: { type: new GraphQLList(Group_type) },
        attendance: {
            type: new GraphQLList(Attendance_type),
            async resolve({ id: user_id }) {
                return await Attendances_schema.find({ user_id });
            },
        },
    }),
});
// User Type
module.exports = new GraphQLObjectType({
    name: "ser",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
    }),
});
/*
{
    Organization{
        Center[{
            Group[{
                Subgroup[{
                    Parent[{
                        Student[{
                            subject[{
                                
                            }]
                            attendance[{
                                
                            }]
                        }]
                    }]
                }]
            }]
        }]
    }
}
*/
