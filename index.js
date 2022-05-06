import surah from "./parts/surah";
// fetch
import getUserData from "./parts/actions/fetch/getUserData";
// export
export default {
    state: () => ({
        user: {
            name: "malik",
            rules: [{ title: "teacher" }, { title: "parent" }],
        },
        groups: [
            {
                id: "5555",
                title: "المتميز",
                students: [
                    {
                        id: "8989",
                        name: "omar",
                    },
                ],
                courses: [
                    {
                        id: "7",
                        title: "$vuetify.quran",
                        channels: [
                            {
                                id: "4566",
                                title: "حفظ",
                                subgroups: [
                                    {
                                        id: "444",
                                        title: "مجموعة فرعية 1",
                                        students: [
                                            {
                                                id: "0",
                                                name: "ahmed",
                                                plans: [
                                                    {
                                                        surah: "Al-Israa",
                                                        from: "A14",
                                                        to: "P3",
                                                        date: new Date(),
                                                        progress: "",
                                                    },
                                                ],
                                                history: [{}],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
        surah,
    }),
    actions: {
        getUserData,
        pushRouter(_, link) {
            console.log(this.app.router.currentRoute.path, link);
            return `${this.app.router.currentRoute.path}${link}`;
        },
    },
};
