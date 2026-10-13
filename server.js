const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});
app.get("/fees.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "fess.html"));
});
mongoose.connect("mongodb+srv://managesys:managesys@cluster0.sj370we.mongodb.net/?appName=Cluster0"/User)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("MongoDB Error:", err));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/fees", require("./routes/feeRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.get("/api/dashboard", async (req, res) => {
    try {
        const Student = require("./models/Student");
        const Course = require("./models/Course");
        const Staff = require("./models/Staff");
        const Fee = require("./models/Fee");
        const students = await Student.countDocuments();
        const courses = await Course.countDocuments();
        const staff = await Staff.countDocuments();
        const fees = await Fee.find();
        const totalCollected = fees.reduce(
            (sum, f) => sum + Number(f.amount || 0), 0
        );
        const studentData = await Student.find();
        const totalPending = studentData.reduce(
            (sum, x) =>
                sum + Math.max(
                    Number(x.totalFees || 0) - Number(x.feesPaid || 0), 0
                ), 0
        );
        res.json({
            students,
            courses,
            staff,
            totalCollected,
            totalPending
        });
    } catch (err) {
        res.status(500).json({ message: "Dashboard error" });
    }
});
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});