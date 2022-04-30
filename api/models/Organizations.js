const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Organizations = new Schema(
    {
        name: String,
    },
    { timestamps: true, collection: "Organizations" }
);

module.exports = mongoose.model("Organizations", Organizations);
