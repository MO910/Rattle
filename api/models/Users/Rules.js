const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Rules = new Schema(
    {
        title: String,
    },
    { timestamps: true, collection: "Rules" }
);

module.exports = mongoose.model("Rules", Rules);
