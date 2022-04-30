const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
// User Type
module.exports = new GraphQLObjectType({
    name: "Student_Attendance",
    fields: () => ({
        id: { type: GraphQLID },
        attended: { type: GraphQLBoolean },
    }),
});
