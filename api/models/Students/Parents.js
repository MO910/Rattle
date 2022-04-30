const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Parents = new Schema(
    {
        name: String,
        birth_day: Date,
        gender: String,
        phone: String,
    },
    { timestamps: true, collection: "Parents" }
);

module.exports = mongoose.model("Parents", Parents);
