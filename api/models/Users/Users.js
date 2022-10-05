const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Users = new Schema(
    {
        organization_id: mongoose.ObjectId,
        parent_id: mongoose.ObjectId,
        name: String,
        email: String,
        password: String,
        rule_ids: Array,
        birth_day: Date,
        gender: Boolean,
        phone: String,
    },
    { timestamps: true, collection: "Users" }
);

module.exports = mongoose.model("Users", Users);
