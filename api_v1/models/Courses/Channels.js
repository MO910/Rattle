const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Channels = new Schema(
    {
        title: String,
        course_id: mongoose.ObjectId,
        description: String,
    },
    { timestamps: true, collection: "Channels" }
);

module.exports = mongoose.model("Channels", Channels);
