const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Subjects = new Schema(
    {
        name: String,
        description: String,
    },
    { timestamps: true, collection: "Subjects" }
);

module.exports = mongoose.model("Subjects", Subjects);
