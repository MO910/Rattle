const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Groups = new Schema(
    {
        title: String,
        center_id: Date,
        teacher_id: mongoose.ObjectId,
        admin_id: mongoose.ObjectId,
        student_ids: Array,
        times: Array,
    },
    { timestamps: true, collection: "Groups" }
);

module.exports = mongoose.model("Groups", Groups);
