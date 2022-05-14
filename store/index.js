import surah from "./parts/surah";
// authentication
import login from "./parts/actions/authentication/login";
import logout from "./parts/actions/authentication/logout";
// fetch
import getUserData from "./parts/actions/fetch/getUserData";
import getGroups from "./parts/actions/fetch/getGroups";
// Advancements
import updateGoalsHistory from "./parts/actions/Goals/updateHistory";
import addGoal from "./parts/actions/Goals/addGoal";
// export
export default {
    state: () => ({
        user: {},
        groups: {},
        surah,
        // login
        loginForm: {
            valid: false,
            username: "",
            password: "",
            error: "",
            showPassword: false,
            loading: false,
        },
    }),
    actions: {
        // authentication
        login,
        logout,
        // fetch
        getUserData,
        getGroups,
        // Advancements
        addGoal,
        updateGoalsHistory,
    },
    mutations: {
        updateModel(state, [obj, value]) {
            // console.log(obj, value);
            eval(`state.${obj} = value`);
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
