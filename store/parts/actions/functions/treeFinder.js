// function
const treeFinder = ({ id, tree, out, branch, counter = 0, foundIn = [] }) => {
    counter++;
    branch = branch[tree[counter - 1]];
    // if the branch is not iterable
    // branch = Array.isArray(branch) ? branch : [branch];
    // loop throw the array
    branch.forEach((child, i) => {
        // save path to the node
        foundIn[counter - 1] = i;
        // break recursion
        if (counter >= tree.length) {
            if (child.id === id)
                // form the output to use eval with it
                out = foundIn
                    .reduce((acc, curr, i) => {
                        acc += `${tree[i]}[${curr}].`;
                        return acc;
                    }, "")
                    .replace(/\.$/, "");
            return;
        }
        // call again
        out = treeFinder({
            branch: child,
            id,
            tree,
            out,
            counter,
            foundIn,
        });
    });
    return out;
};
// export
export default treeFinder;
