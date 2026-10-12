const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    studentName: String,
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Present", "Absent"],
         required: true
    }
   
}, { timestamps: true });
module.exports = mongoose.model("Attendance", attendanceSchema);