// Dependencies
import treeFinder from "./treeFinder";
// export
export default class {
    constructor({ state, commit, request, dataKey }) {
        this.state = state;
        this.commit = commit;
        this.request = request;
        this.dataKey = dataKey;
    }
    // add item response
    async add({ requestData, id, nodePath, tree, targetArray, refresh }) {
        const { state, commit } = this;
        // search for node if not provided
        nodePath =
            nodePath ||
            treeFinder({
                id,
                tree,
                branch: state,
            });
        let fullPath = nodePath;
        // console.log(fullPath);
        if (targetArray) fullPath += `.${targetArray}`;
        // push the object to it
        // console.log(`state.${fullPath}?.length`);
        const itemIndex = eval(`state.${fullPath}?.length`);
        commit("push", [`${fullPath}`, requestData]);
        // try the request
        try {
            this.data = await this.request();
            const itemId = this.data[this.dataKey]?.id;
            // update state and add ID (real response)
            commit("updateModel", [`${fullPath}[${itemIndex}].id`, itemId]);
        } catch (err) {
            // if error delete the added item
            commit("remove", [fullPath, itemIndex]);
            console.log(err);
        }
        // refresh
        refresh = refresh || fullPath;
        commit("refreshObj", refresh);
    }
    // remove item response
    async remove({ id, tree, targetArray }) {
        const { state, commit } = this;
        //
        const nodePath = treeFinder({
                id,
                tree,
                branch: state,
            }),
            indexRegExp = /\[\d+\]$/,
            allListPath = nodePath.replace(indexRegExp, "");
        // console.log(nodePath, allListPath);
        // hide temporary until it is cleared from DB (optimistic response)
        commit("updateModel", [`${nodePath}.hide`, true]);
        commit("refreshObj", allListPath);
        // console.log(nodePath);
        try {
            this.data = await this.request();
            // if not deleted threw error
            if (!this.data[this.dataKey]) throw "error";
            // delete the element form list (real response)
            const index = nodePath.match(indexRegExp)[0].replace(/\[|\]/g, "");
            commit("remove", [allListPath, index]);
        } catch (err) {
            // if error restore the item
            commit("updateModel", [`${nodePath}.hide`, false]);
            commit("refreshObj", nodePath.replace(/\[\d+\]$/, ""));
        }
        // console.log(this.data);
    }
}
//
