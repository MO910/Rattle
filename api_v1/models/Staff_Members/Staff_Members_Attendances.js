const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Staff_Members_Attendances = new Schema(
    {
        name: String,
        staff_members_id: mongoose.ObjectId,
        attended: Boolean,
    },
    { timestamps: true, collection: "Staff_Members_Attendances" }
);

module.exports = mongoose.model(
    "Staff_Members_Attendances",
    Staff_Members_Attendances
);
