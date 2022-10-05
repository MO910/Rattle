const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Goals_History = new Schema(
    {
        user_id: mongoose.ObjectId,
        goal_id: mongoose.ObjectId,
        point: Number,
    },
    { timestamps: true, collection: "Goals_History" }
);

module.exports = mongoose.model("Goals_History", Goals_History);
