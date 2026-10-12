const mongoose = require("mongoose");
const feeSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    studentName: String,
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        default: "Cash"
    },
    receiptNo: String,
    paymentDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
module.exports = mongoose.model("Fee", feeSchema);