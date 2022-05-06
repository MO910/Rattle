const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Advancements = new Schema(
    {
        user_id: mongoose.ObjectId,
        channel_id: mongoose.ObjectId,
        chapter: String,
        from: Number,
        to: Number,
        date: Date,
        history: Array,
        note: String,
    },
    { timestamps: true, collection: "Advancements" }
);

module.exports = mongoose.model("Advancements", Advancements);
