const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
//
const Student_Attendance_type = require("./Student_Attendance");
const Students_Attendances_schema = require("../../../models/Students/Students_Attendances");
// User Type
module.exports = new GraphQLObjectType({
    name: "Student",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        birth_day: { type: GraphQLInt },
        gender: { type: GraphQLString },
        phone: { type: GraphQLString },
        attendance: {
            type: new GraphQLList(Student_Attendance_type),
            async resolve({ id: student_id }) {
                return await Students_Attendances_schema.find({ student_id });
            },
        },
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
