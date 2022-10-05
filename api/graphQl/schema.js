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
    Groups_schema = require("../models/Groups/Groups"),
    // Organization
    Organization_type = require("./types/Organization"),
    Organizations_schema = require("../models/Organizations"),
    // center
    Center_type = require("./types/Center"),
    Centers_schema = require("../models/Centers");
// mutations
const // Goals
    addPlan = require("./mutations/Plans/addPlan");
/*
    removeGoal = require("./mutations/Goals/removeGoal"),
    updateGoalsHistory = require("./mutations/Goals/updateHistory"),
    // Users
    createUser = require("./mutations/Users/createUser"),
    // Organization
    createOrganization = require("./mutations/createOrganization"),
    // Center
    createCenter = require("./mutations/createCenter"),
    // rule convert function
    rulesConverter = require("./types/shared/rulesConverter");
*/
//
const query = new GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            // get user info
            user: {
                type: new GraphQLList(User_type),
                args: {
                    id: { type: GraphQLID },
                    organization_id: { type: GraphQLID },
                    rules: { type: new GraphQLList(GraphQLString) },
                },
                async resolve(_, { id, organization_id, rules }) {
                    const rule_ids = rules && (await rulesConverter({ rules }));
                    // filter the empty keys
                    let query = { _id: id, organization_id, rule_ids };
                    query = Object.entries(query).reduce((a, [k, v]) => {
                        v && (a[k] = v);
                        return a;
                    }, {});
                    // search and return
                    return await Users_schema.find(query);
                },
            },
            groups: {
                type: new GraphQLList(Group_type),
                args: { userId: { type: GraphQLID } },
                async resolve(_, { userId }) {
                    return await Groups_schema.find({ teacher_id: userId });
                },
            },
            organization: {
                type: Organization_type,
                args: { userId: { type: GraphQLID } },
                async resolve(_, { userId }) {
                    const orgs = await Organizations_schema.find({
                        owner_id: userId,
                    });
                    return orgs?.[0];
                },
            },
        },
    }),
    mutation = new GraphQLObjectType({
        name: "mutation",
        fields: {
            //         createUser,
            //         createOrganization,
            //         createCenter,
            addPlan,
        },
    });
// exports
module.exports = new GraphQLSchema({ query, mutation });
