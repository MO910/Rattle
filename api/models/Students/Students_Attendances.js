const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Students_Attendances = new Schema(
    {
        student_id: mongoose.ObjectId,
        attended: Boolean,
    },
    { timestamps: true, collection: "Students_Attendances" }
);

module.exports = mongoose.model("Students_Attendances", Students_Attendances);
