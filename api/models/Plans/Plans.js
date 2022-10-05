const mongoose = require("mongoose"),
    Schema = mongoose.Schema;
const Plans = new Schema(
    {
        subgroup_id: mongoose.ObjectId,
        title: String,
        order_reversed: Boolean,

        from: Number,
        amount: Number,
        weeks: Number,

        // has_rabt: Boolean,
        rabt_amount: Number,

        working_days: Array,
        starting_at: Date,
        note: String,
    },
    { timestamps: true, collection: "Plans" }
);

module.exports = mongoose.model("Plans", Plans);
