const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
//
const // user
    Student_type = require("./Student"),
    Students_schema = require("../../../models/Students/Students");
// User Type
module.exports = new GraphQLObjectType({
    name: "Parent",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        birth_day: { type: GraphQLInt },
        gender: { type: GraphQLString },
        phone: { type: GraphQLString },
        students: {
            type: new GraphQLList(Student_type),
            async resolve({ id: parent_id }) {
                return await Students_schema.find({ parent_id });
            },
        },
    }),
});
