const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
//
const history_type = require("./History");
history_schema = require("../../../../models/Courses/Advancements/History");
// User Type
module.exports = new GraphQLObjectType({
    name: "Advancements",
    fields: () => ({
        id: { type: GraphQLID },
        chapter: { type: GraphQLString },
        from: { type: GraphQLInt },
        to: { type: GraphQLInt },
        date: { type: GraphQLString },
        history: {
            type: new GraphQLList(history_type),
            async resolve({ id: Advancement_id }) {
                return await history_schema.find({ Advancement_id });
            },
        },
        note: { type: GraphQLString },
    }),
});
