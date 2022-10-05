const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Attendances = new Schema(
    {
        user_id: mongoose.ObjectId,
        attended: Boolean,
    },
    { timestamps: true, collection: "Attendances" }
);

module.exports = mongoose.model("Attendances", Attendances);
