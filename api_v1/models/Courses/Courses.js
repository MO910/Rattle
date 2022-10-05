const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Courses = new Schema(
    {
        title: String,
        group_id: mongoose.ObjectId,
        description: String,
    },
    { timestamps: true, collection: "Courses" }
);

module.exports = mongoose.model("Courses", Courses);
