// Dependencies
import treeFinder from "./treeFinder";
// export
export default class {
    constructor({ state, commit, dispatch, request, dataKey }) {
        this.state = state;
        this.commit = commit;
        this.dispatch = dispatch;
        this.request = request;
        this.dataKey = dataKey;
    }
    // add item response
    async add({
        requestData,
        id,
        nodePath,
        tree,
        targetArray,
        refresh,
        doRequest = true,
    }) {
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
        if (targetArray) fullPath += `.${targetArray}`;
        // push the object to it
        const itemIndex = eval(`state.${fullPath}?.length`);
        let spread = requestData instanceof Array;
        commit("push", [fullPath, requestData, "push", spread]);
        // try the request
        try {
            if (doRequest) {
                this.data = await this.request();
                const response = this.data[this.dataKey];
                // update state and add ID (real response)
                if (response instanceof Array) {
                    console.log(`${fullPath}[${itemIndex}]`);
                    commit("updateModel", [fullPath, response]);
                } else {
                    const itemId = this.data[this.dataKey]?.id;
                    commit("updateModel", [
                        `${fullPath}[${itemIndex}].id`,
                        itemId,
                    ]);
                }
            }
        } catch (err) {
            // if error delete the added item
            commit("remove", [fullPath, itemIndex]);
            console.log(err);
        }
        // refresh
        refresh = refresh || fullPath;
        commit("refreshObj", refresh);
        return this.data?.[this.dataKey];
    }
    // remove item response
    async remove({ id, tree, callback }) {
        const { state, commit } = this;
        const nodePath = treeFinder({
                id,
                tree,
                branch: state,
            }),
            indexRegExp = /\[\d+\]$/,
            allListPath = nodePath.replace(indexRegExp, "");
        // hide temporary until it is cleared from DB (optimistic response)
        commit("updateModel", [`${nodePath}.hide`, true]);
        commit("refreshObj", allListPath);
        try {
            this.data = await this.request();
            // if not deleted threw error
            if (!this.data[this.dataKey]) throw "error";
            // delete the element form list (real response)
            const index = nodePath.match(indexRegExp)[0].replace(/\[|\]/g, "");
            // unhide the element
            commit("updateModel", [`${nodePath}.hide`, false]);
            // and store it for returning
            const element = { ...eval(`state.${allListPath}[${index}]`) };
            // do action before actually removing
            if (callback) await callback(element);
            console.log(allListPath, index);
            // actually remove the element
            commit("remove", [allListPath, index]);
            return [allListPath, element];
        } catch (err) {
            console.log(err);
            // if error restore the item
            commit("updateModel", [`${nodePath}.hide`, false]);
            commit("refreshObj", nodePath.replace(/\[\d+\]$/, ""));
        }
    }
    //
    async update({ id, requestData, tree, targetArray }) {
        const { state, commit } = this;
        const nodePath = treeFinder({
            id,
            tree,
            branch: state,
        });
        let fullPath = nodePath;
        if (targetArray) fullPath += `.${targetArray}`;
        const oldValue = eval(`state.${fullPath}`);
        // update state optimistically
        commit("updateModel", [fullPath, { ...oldValue, ...requestData }]);
        // try the request
        try {
            this.data = await this.request();
        } catch (err) {
            // undo optimistic
            commit("updateModel", [fullPath, oldValue]);
            console.log(err);
        }
    }
    // transport from array to another
    async transport({ removeId, addId, treeFrom, treeTo }) {
        // remove the existing entity
        const requestData = await this.remove({ id: removeId, tree: treeFrom });
        // add it to ...
        await this.add({
            doRequest: false,
            id: addId,
            requestData,
            tree: treeTo.slice(0, -1),
            targetArray: treeTo.at(-1),
        });
    }
}
//
