const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Users = new Schema(
    {
        organization_id: mongoose.ObjectId,
        parent_id: mongoose.ObjectId,
        group_id: mongoose.ObjectId,
        email: String,
        password: String,
        name: String,
        rule_ids: Array,
        birth_day: Date,
        gender: String,
        phone: String,
    },
    { timestamps: true, collection: "Users" }
);

module.exports = mongoose.model("Users", Users);
