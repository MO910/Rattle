const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLSchema,
} = require("graphql");
const // user
    Student_type = require("./types/Students/Student"),
    Students_schema = require("../models/Students/Students");
const // parent
    Parent_type = require("./types/Students/Parent"),
    Parents_schema = require("../models/Students/Parents");
//
const query = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // get student info
        student: {
            type: Student_type,
            args: { id: { type: GraphQLID } },
            async resolve(_, { id }) {
                return await Students_Schema.findById(id);
            },
        },
        // get parent info
        parent: {
            type: Parent_type,
            args: { id: { type: GraphQLID } },
            async resolve(_, { id }) {
                return await Parents_schema.findById(id);
            },
        },
    },
});
// exports
module.exports = new GraphQLSchema({ query });
