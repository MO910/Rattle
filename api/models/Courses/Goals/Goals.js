const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Goals = new Schema(
    {
        subgroup_id: mongoose.ObjectId,
        chapter: String,
        from: Number,
        to: Number,
        date: Date,
        note: String,
    },
    { timestamps: true, collection: "Goals" }
);

module.exports = mongoose.model("Goals", Goals);
