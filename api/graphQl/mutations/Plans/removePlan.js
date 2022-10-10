const {
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean,
} = require("graphql");
const Plans_Schema = require("../../../models/Plans/Plans");
// Function
module.exports = {
    type: GraphQLBoolean,
    args: {
        id: { type: GraphQLID },
    },
    async resolve(_, { id }) {
        return !!(await Plans_Schema.findByIdAndDelete(id));
    },
};
