const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLSchema,
} = require("graphql");
const // user
    User_type = require("./types/Users/User"),
    Users_schema = require("../models/Users/Users"),
    Rules_schema = require("../models/Users/Rules"),
    // group
    Group_type = require("./types/Groups/Group"),
    Groups_schema = require("../models/Groups/Groups");
// mutations
const // Goals
    addGoal = require("./mutations/Goals/addGoal"),
    updateGoalsHistory = require("./mutations/Goals/updateHistory");
//
const query = new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            // get student info
            user: {
                type: User_type,
                args: {
                    id: { type: GraphQLID },
                    channel_id: { type: GraphQLID },
                },
                async resolve(_, { id }) {
                    return await Users_schema.findById(id);
                },
            },
            groups: {
                type: new GraphQLList(Group_type),
                args: { userId: { type: GraphQLID } },
                async resolve(_, { userId }) {
                    return await Groups_schema.find({ teacher_id: userId });
                },
            },
        },
    }),
    mutation = new GraphQLObjectType({
        name: "mutation",
        fields: { addGoal, updateGoalsHistory },
    });
// exports
module.exports = new GraphQLSchema({ query, mutation });
