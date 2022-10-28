// Dependencies
import gql from "graphql-tag";
import Optimistic from "../functions/Optimistic";
import treeFinder from "../functions/treeFinder";
// function
export default function ({ state, commit }, { tree, id }) {
    const nodePath = treeFinder({
        id,
        tree,
        branch: state,
    });
    return eval(`state.${nodePath}`);
}
