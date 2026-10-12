const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: String,
    fees: {
        type: Number,
        default: 0
    },
    description: String
}, { timestamps: true });
module.exports = mongoose.model("Course", courseSchema);