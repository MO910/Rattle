const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Const_Salaries = new Schema(
    {
        name: String,
        staff_members_id: mongoose.ObjectId,
        amount: Number,
    },
    { timestamps: true, collection: "Const_Salaries" }
);

module.exports = mongoose.model("Const_Salaries", Const_Salaries);
