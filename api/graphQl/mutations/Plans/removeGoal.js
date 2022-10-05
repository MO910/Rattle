const {
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean,
} = require("graphql");
const History_Schema = require("../../../models/Courses/Goals/History"),
    Goals_Schema = require("../../../models/Courses/Goals/Goals");
// Function
module.exports = {
    type: GraphQLBoolean,
    args: {
        id: { type: GraphQLID },
    },
    async resolve(_, { id }) {
        const rGoal = await Goals_Schema.findByIdAndDelete(id),
            hGoal = await History_Schema.deleteMany({ goal_id: id });
        return rGoal && !!hGoal;
    },
};
