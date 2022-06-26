// Dependencies
import gql from "graphql-tag";
import treeFinder from "../functions/treeFinder";
// function
export default async function ({ state, commit }) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        {
            data: { groups },
        } = await client.query({
            query: gql`
                query groups {
                    groups(userId: "626d45dd2e600ed075c196ca") {
                        id
                        title
                        students {
                            id
                            name
                            attendances {
                                id
                                attended
                            }
                            goals_history {
                                id
                                goal_id
                                point
                            }
                        }
                        courses {
                            id
                            title
                            channels {
                                id
                                title
                                subgroups {
                                    id
                                    title
                                    goals {
                                        id
                                        chapter
                                        from
                                        to
                                    }
                                    students {
                                        id
                                        name
                                        attendances {
                                            id
                                            attended
                                        }
                                        goals_history {
                                            id
                                            goal_id
                                            point
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
        });
    // update store
    commit("updateModel", ["groups", groups]);
    // }
}
