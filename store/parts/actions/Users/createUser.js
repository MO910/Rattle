// Dependencies
import gql from "graphql-tag";
import randomPassword from "../functions/randomPassword";
import Optimistic from "../functions/Optimistic";
// function
export default async function (
    { state, commit },
    { email, password, name, phone, rule, nodePath }
) {
    // if (this.$auth.loggedIn && this.$auth.user && !state.user.id) {
    // state.userId = this.$auth.user._id;
    const organization_id = state.organization?.id;
    // generate a random password if there is null passed
    password ||= randomPassword();
    // GraphQl request
    const request = async () => {
        const client = this.app.apolloProvider.defaultClient,
            { data } = await client.mutate({
                mutation: gql`
                    mutation {
                        createUser(
                            email: "${email}"
                            password: "${password}"
                            name: "${name}"
                            ${phone ? `phone: "${phone}"` : ""}
                            rules: ${JSON.stringify(rule)}
                            organization_id: "${organization_id}"
                        ){
                            id
                        }
                    }
                `,
            });
        return data;
    };
    // add optimistic response to the new goal
    const optimistic = new Optimistic({
        state,
        commit,
        request,
        dataKey: "createUser",
    });
    optimistic.add({
        requestData: {
            organization_id,
            name,
            email,
            phone,
            rule_ids: [rule],
        },
        nodePath,
    });
    // }
}
