const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Subgroups = new Schema(
    {
        name: String,
        group_id: mongoose.ObjectId,
    },
    { timestamps: true, collection: "Subgroups" }
);

module.exports = mongoose.model("Subgroups", Subgroups);
