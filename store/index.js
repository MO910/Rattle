import surahAdj from "./parts/surahAdj";
import versesPerPage from "./parts/versesPerPage";
// Authentication
import login from "./parts/actions/authentication/login";
import logout from "./parts/actions/authentication/logout";
// Fetch
import getUserData from "./parts/actions/fetch/getUserData";
import getGroups from "./parts/actions/fetch/getGroups";
import getSubgroupHistoryAtDate from "./parts/actions/fetch/getSubgroupHistoryAtDate";
import getOrganization from "./parts/actions/fetch/getOrganization";
// import getTeachers from "./parts/actions/fetch/getTeachers";
// import getStudents from "./parts/actions/fetch/getUsers";
import getUsers from "./parts/actions/fetch/getUsers";
// Plans
import addPlan from "./parts/actions/Plans/addPlan";
import removePlan from "./parts/actions/Plans/removePlan";
import updateHistory from "./parts/actions/Plans/updateHistory";
// User
import createUser from "./parts/actions/Users/createUser";
import updateUser from "./parts/actions/Users/updateUser";
// Organizations
import createOrganization from "./parts/actions/createOrganization";
// Center
import createCenter from "./parts/actions/createCenter";
// export
export default {
    state: () => ({
        user: {},
        users: [],
        groups: {},
        plans: [],
        plansToTables: [],
        versesPerPage,
        surahAdj,
        // login
        loginForm: {
            valid: false,
            email: "",
            password: "",
            error: "",
            showPassword: false,
            loading: false,
        },
        addCenterForm: {
            dialog: false,
        },
        importExcel: {
            dialog: false,
            data: null,
        },
        addUserDialog: false,
        editUserForm: {
            dialog: false,
            user: {},
        },
        addPlanForm: {
            ayahValue: 1,
            pagesValue: 1,
            rabtPagesValue: 1,
        },
        //
        selectedDateHistory: [],
    }),
    actions: {
        // authentication
        login,
        logout,
        // fetch
        getUserData,
        getGroups,
        getSubgroupHistoryAtDate,
        getOrganization,
        getUsers,
        // Advancements
        updateHistory,
        addPlan,
        removePlan,
        // User
        createUser,
        updateUser,
        // Organizations
        createOrganization,
        // Center
        createCenter,
        // concatenate full name
        fullName(user) {
            return `${user.first_name} ${user.parent_name || ""}`;
        },
    },
    mutations: {
        updateModel(state, [obj, value]) {
            // console.log(obj, value);
            eval(`state.${obj} = value`);
        },
        refreshObj(state, obj) {
            // console.log(obj, value);
            const isArray = Array.isArray(eval(`state.${obj}`));
            eval(
                `state.${obj} = ${isArray ? "[" : "{"}...state.${obj}${
                    isArray ? "]" : "}"
                }`
            );
        },
        push(state, [obj, value, method = "push"]) {
            const target = eval(`state.${obj}`);
            target[method](value);
        },
        remove(state, [obj, index]) {
            const target = eval(`state.${obj}`);
            target.splice(index, 1);
        },
    },
};

// [
//     {
//         id: "5555",
//         title: "المتميز",
//         students: [
//             {
//                 id: "8989",
//                 name: "omar",
//             },
//         ],
//         courses: [
//             {
//                 id: "7",
//                 title: "$vuetify.quran",
//                 channels: [
//                     {
//                         id: "4566",
//                         title: "حفظ",
//                         subgroups: [
//                             {
//                                 id: "444",
//                                 title: "مجموعة فرعية 1",
//                                 students: [
//                                     {
//                                         id: "0",
//                                         name: "ahmed",
//                                         plans: [
//                                             {
//                                                 surah: "Al-Israa",
//                                                 from: "A14",
//                                                 to: "A30",
//                                                 date: new Date(),
//                                                 history: [{
//                                                      point: "A22",
//                                                      date: date
//                                                 }]
//                                             },
//                                         ],
//                                         assignments: [{}],
//                                     },
//                                 ],
//                             },
//                         ],
//                     },
//                 ],
//             },
//         ],
// },
// ],
