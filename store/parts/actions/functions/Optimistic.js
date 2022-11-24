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
    async remove({ id, tree, callbackBefore, callbackAfter }) {
        const { state, commit } = this;
        const nodePath = treeFinder({
                id,
                tree,
                branch: state,
            }),
            indexRegExp = /\[\d+\]$/,
            allListPath = nodePath.replace(indexRegExp, ""),
            findItemPath = `${allListPath}.find(x => x.id =="${id}")`;
        // and store it for returning
        const element = { ...eval(`state.${findItemPath}`) };
        // element.hide = false;
        // hide temporary until it is cleared from DB (optimistic response)
        commit("updateModel", [`${findItemPath}.hide`, true]);
        // do action before actually removing
        if (callbackBefore) await callbackBefore(element);
        // refresh
        commit("refreshObj", allListPath);
        // prepare output
        let output = [allListPath, element];
        try {
            this.data = await this.request();
            // add the data
            output.push(this.data[this.dataKey]);
            // if not deleted threw error
            if (!this.data[this.dataKey]) throw "error";
            // do action after actually removing
            if (callbackAfter)
                await callbackAfter(findItemPath, ...output.slice(1));
            // delete the element form list (real response)
            const index = eval(`state.${allListPath}`).reduce(
                (acc, item, i) => {
                    if (item.id == id) return i;
                    return acc;
                },
                null
            );
            // unhide the element
            commit("updateModel", [`${findItemPath}.hide`, false]);
            // actually remove the element
            if (index != null) commit("remove", [allListPath, index]);
            return output;
        } catch (err) {
            console.log(err);
            // if error restore the item
            commit("updateModel", [`${findItemPath}.hide`, false]);
            commit("refreshObj", allListPath);
            return output;
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
            console.log(err);
            // undo optimistic
            commit("updateModel", [fullPath, oldValue]);
        }
    }
    // transport from array to another
    async transport({ removeId, addId, treeFrom, treeTo }) {
        // remove the existing entity
        const [_, requestData] = await this.remove({
            id: removeId,
            tree: treeFrom,
        });
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
