const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Students = new Schema(
    {
        name: String,
        parent_id: mongoose.ObjectId,
        group_id: mongoose.ObjectId,
        birth_day: Date,
        gender: String,
        phone: String,
    },
    { timestamps: true, collection: "Students" }
);

module.exports = mongoose.model("Students", Students);
