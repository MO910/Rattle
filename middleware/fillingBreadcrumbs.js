export default async ({ store, route }) => {
    const originalPath = route.fullPath.split("/").filter((x) => x);
    let fullPath = route.fullPath;
    for (let idType in route.params) {
        let tree;
        if (idType === "groupId") tree = ["groups"];
        else if (idType === "courseId") tree = ["groups", "courses"];
        else if (idType === "subgroupId")
            tree = ["groups", "courses", "subgroups"];
        if (!tree) return;
        // get groups if null
        await store.dispatch("getGroups");
        // get the ids title
        let entity = await store.dispatch("decodeId", {
            tree,
            id: route.params[idType],
        });
        if (entity?.title)
            fullPath = fullPath.replace(route.params[idType], entity?.title);
        // if the subgroup is students
        else {
            let entity = await store.dispatch("decodeId", {
                tree: ["groups", "courses", "floatingStudents"],
                id: route.params[idType],
            });
            if (entity?.first_name)
                fullPath = fullPath.replace(
                    route.params[idType],
                    `${entity?.first_name} ${entity?.parent_name || ""}`
                );
        }
    }
    fullPath = fullPath.split("/").filter((x) => x);
    // style it
    let newValue = fullPath.map((link, i) => ({
        text: link,
        href: `/${originalPath.slice(0, i + 1).join("/")}`,
    }));
    // store the results
    store.commit("updateModel", ["breadcrumbs", newValue]);
};
