const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Subgroups = new Schema(
    {
        title: String,
        channel_id: mongoose.ObjectId,
        group_id: mongoose.ObjectId,
        student_ids: Array,
    },
    { timestamps: true, collection: "Subgroups" }
);

module.exports = mongoose.model("Subgroups", Subgroups);
