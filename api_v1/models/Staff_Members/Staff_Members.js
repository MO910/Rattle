const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Staff_Members = new Schema(
    {
        name: String,
        rule_id: mongoose.ObjectId,
        birth_day: Date,
        gender: String,
        phone: String,
    },
    { timestamps: true, collection: "Staff_Members" }
);

module.exports = mongoose.model("Staff_Members", Staff_Members);
