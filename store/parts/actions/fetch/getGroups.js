// Dependencies
import gql from "graphql-tag";
// function
export default async function ({ commit }) {
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
                        courses {
                            id
                            title
                            channels {
                                id
                                title
                                subgroups {
                                    id
                                    title
                                    students {
                                        id
                                        name
                                        attendances {
                                            id
                                            attended
                                        }
                                        advancements {
                                            id
                                            chapter
                                            to
                                            from
                                            history {
                                                point
                                            }
                                            note
                                            date
                                        }
                                    }
                                }
                            }
                        }
                        students {
                            id
                            name
                            attendances {
                                id
                                attended
                            }
                            advancements {
                                id
                                chapter
                                to
                                from
                                history {
                                    point
                                }
                                note
                                date
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
