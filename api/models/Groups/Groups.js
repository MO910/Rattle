const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Groups = new Schema(
    {
        name: String,
        teacher_id: mongoose.ObjectId,
        admin_id: mongoose.ObjectId,
        center_id: Date,
        times: Array,
    },
    { timestamps: true, collection: "Groups" }
);

module.exports = mongoose.model("Groups", Groups);
