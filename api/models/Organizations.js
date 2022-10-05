const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Organizations = new Schema(
    {
        owner_id: mongoose.ObjectId,
        name: String,
        description: String,
    },
    { timestamps: true, collection: "Organizations" }
);

module.exports = mongoose.model("Organizations", Organizations);
