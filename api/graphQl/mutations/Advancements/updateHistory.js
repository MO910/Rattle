const {
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean,
} = require("graphql");
const History_Schema = require("../../../models/Courses/Advancements/History");
// Function
module.exports = {
    type: GraphQLBoolean,
    args: {
        advancement_id: { type: GraphQLID },
        point: { type: GraphQLInt },
    },
    async resolve(_, { advancement_id, point }) {
        // Update User record
        const $gte = new Date(new Date().toLocaleString().split(",")[0]),
            $lte = new Date(new Date($gte).setDate($gte.getDate() + 1)),
            exists = await History_Schema.findOneAndUpdate(
                {
                    advancement_id,
                    createdAt: { $gte, $lte },
                },
                { $inc: { point } }
            );
        return !(
            !exists && !(await History_Schema.create({ advancement_id, point }))
        );
    },
};
