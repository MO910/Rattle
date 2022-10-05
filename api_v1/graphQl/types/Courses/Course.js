const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} = require("graphql");
// courses
const channel_type = require("./Channel"),
    channels_schema = require("../../../models/Courses/Channels");
// User Type
module.exports = new GraphQLObjectType({
    name: "Course",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        channels: {
            type: new GraphQLList(channel_type),
            async resolve({ id: course_id }) {
                return await channels_schema.find({ course_id });
            },
        },
    }),
});
