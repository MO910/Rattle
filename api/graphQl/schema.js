const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLSchema,
} = require("graphql");
const // user
    userType = require("./types/user"),
    userSchema = require("../models/user.js");
//
const query = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // get user info
        user: {
            type: userType,
            args: { id: { type: GraphQLID } },
            async resolve(_, { id }) {
                return await userSchema.findById(id);
            },
        },
    },
});
// exports
module.exports = new GraphQLSchema({ query });
