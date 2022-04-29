const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const users = new Schema(
    {
        name: String,
    },
    { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("users", users);
