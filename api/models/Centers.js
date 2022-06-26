const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Centers = new Schema(
    {
        name: String,
        organization_id: mongoose.ObjectId,
        admin_id: mongoose.ObjectId,
        address: String,
    },
    { timestamps: true, collection: "Centers" }
);

module.exports = mongoose.model("Centers", Centers);
