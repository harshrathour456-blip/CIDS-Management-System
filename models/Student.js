const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    fatherName: String,
    phone: String,
    email: String,
    address: String,
    course: String,
    batch: String,
    admissionDate: {
        type: Date,
        default: Date.now
    },
    totalFees: {
        type: Number,
        default: 0
    },
    feesPaid: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "Active"
    }
}, { timestamps: true });
module.exports = mongoose.model("Student", studentSchema);