//
export default (args) =>
    JSON.stringify(args)
        .replace(/"(\w+)"(?=:)/g, "$1")
        .replace(/^\{|\}$/g, "");
