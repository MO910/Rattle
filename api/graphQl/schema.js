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
    // Plans
    Plan_Schema = require("../models/Plans/Plans"),
    Plan_type = require("./types/Plans/Plan"),
    Plan_History_Schema = require("../models/Plans/Plan_History"),
    Plan_History_type = require("./types/Plans/Plan_History"),
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
    addPlan = require("./mutations/Plans/addPlan"),
    updatePlanHistory = require("./mutations/Plans/updateHistory");
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
            subgroupHistoryAtDate: {
                type: new GraphQLList(Plan_History_type),
                args: {
                    subgroup_id: { type: GraphQLID },
                    date: { type: GraphQLString },
                },
                async resolve(_, { subgroup_id, date }) {
                    // get plans
                    const plans = await Plan_Schema.find({ subgroup_id }),
                        allHistories = await Promise.all(
                            plans.map(async (plan) => {
                                const history = await Plan_History_Schema.find({
                                    plan_id: plan.id,
                                    date: new Date(date),
                                });
                                return history;
                            })
                        );
                    return allHistories.flat();
                },
            },
        },
    }),
    mutation = new GraphQLObjectType({
        name: "mutation",
        fields: {
            addPlan,
            updatePlanHistory,
        },
    });
// exports
module.exports = new GraphQLSchema({ query, mutation });
