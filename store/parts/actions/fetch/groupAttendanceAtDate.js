// Dependencies
import gql from "graphql-tag";
import stringify from "../functions/stringify";
// function
export default async function ({ state, commit }, args) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user?.id) {
    // userId = userId || this.$auth.user._id;
    if (state.AttendanceHistory.some((h) => h.date === args.date)) return;
    const stringifyArgs = stringify(args);
    // GraphQl request
    // GraphQl request
    const client = this.app.apolloProvider.defaultClient,
        {
            data: { groupAttendanceAtDate },
        } = await client.query({
            query: gql`
                query user {
                    groupAttendanceAtDate(${stringifyArgs}) {
                        id
                        first_name
                        parent_name
                        email
                        phone
                        gender
                        attendance{
                            attendance_status
                            note
                        }
                    }
                }`,
        });
    // update store
    commit("push", [
        "AttendanceHistory",
        { date: args.date, students: groupAttendanceAtDate },
    ]);
    // }
}
