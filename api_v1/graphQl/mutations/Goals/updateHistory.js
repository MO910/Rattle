const {
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean,
} = require("graphql");
const History_Schema = require("../../../models/Courses/Goals/History");
// Function
module.exports = {
    type: GraphQLBoolean,
    args: {
        user_id: { type: GraphQLID },
        goal_id: { type: GraphQLID },
        point: { type: GraphQLInt },
    },
    async resolve(_, { user_id, goal_id, point }) {
        // Update User record
        const $gte = new Date(new Date().toLocaleString().split(",")[0]),
            $lte = new Date(new Date($gte).setDate($gte.getDate() + 1)),
            exists = await History_Schema.findOneAndUpdate(
                {
                    user_id,
                    goal_id,
                    createdAt: { $gte, $lte },
                },
                { $inc: { point } }
            );
        return !(
            !exists &&
            !(await History_Schema.create({ user_id, goal_id, point }))
        );
    },
};
