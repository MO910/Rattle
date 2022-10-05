const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Plan_History = new Schema(
    {
        plan_id: mongoose.ObjectId,
        updated_by: mongoose.ObjectId,
        student_id: mongoose.ObjectId,
        amount_done: Number,
        grade: Number,

        rabt_amount_done: Number,
        rabt_grade: Number,

        note: String,
    },
    { timestamps: true, collection: "Plan_History" }
);

module.exports = mongoose.model("Plan_History", Plan_History);
