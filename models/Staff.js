const mongoose = require("mongoose");
const staffSchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: String,
    email: String,
    designation: String,
    salary: {
        type: Number,
        default: 0
    },
    joiningDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
module.exports = mongoose.model("Staff", staffSchema);