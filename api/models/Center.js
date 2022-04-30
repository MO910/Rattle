const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Center = new Schema(
    {
        name: String,
        organization_id: mongoose.ObjectId,
        address: String,
    },
    { timestamps: true, collection: "Center" }
);

module.exports = mongoose.model("Center", Center);
