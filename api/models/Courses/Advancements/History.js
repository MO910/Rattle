const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Advancements_History = new Schema(
    {
        advancement_id: mongoose.ObjectId,
        point: Number,
    },
    { timestamps: true, collection: "Advancements_History" }
);

module.exports = mongoose.model("Advancements_History", Advancements_History);
