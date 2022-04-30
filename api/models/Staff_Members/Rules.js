const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Rules = new Schema(
    {
        name: String,
    },
    { timestamps: true, collection: "Rules" }
);

module.exports = mongoose.model("Rules", Rules);
