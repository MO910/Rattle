const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Users = new Schema(
    {
        name: String,
        rule_ids: Array,
        parent_id: mongoose.ObjectId,
        group_id: mongoose.ObjectId,
        birth_day: Date,
        gender: String,
        phone: String,
    },
    { timestamps: true, collection: "Users" }
);

module.exports = mongoose.model("Users", Users);
