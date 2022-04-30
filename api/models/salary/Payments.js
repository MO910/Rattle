const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Payments = new Schema(
    {
        name: String,
        staff_members_id: mongoose.ObjectId,
        adjust: Number,
    },
    { timestamps: true, collection: "Payments" }
);

module.exports = mongoose.model("Payments", Payments);
