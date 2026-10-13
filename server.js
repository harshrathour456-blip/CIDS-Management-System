const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your email provider's SMTP host
    port: 587,
    secure: false, 
    auth: {
        user: 'YOUR_EMAIL@gmail.com', // Your email
        pass: 'YOUR_EMAIL_APP_PASSWORD', // Your email password or app password
    },
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/fees.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "fess.html"));
});

mongoose.connect("mongodb+srv://managesys:managesys@cluster0.sj370we.mongodb.net/?appName=Cluster0/user")
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("MongoDB Error:", err));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/fees", require("./routes/feeRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));

// ==========================================
// PASSWORD RESET ROUTES
// ==========================================

// 1. Forgot Password (Generate Token & Send Email)
app.post('/api/forgot-password', async (req, res) => {
    try {
        const User = require("./models/User"); // Ensure this path is correct
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
        }

        // Generate token and expiry
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour

        // Save to database
        user.resetToken = resetToken;
        user.resetTokenExpiry = tokenExpiry;
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password.html?token=${resetToken}`;

        await transporter.sendMail({
            from: '"ManageSys Admin" <noreply@managesys.com>',
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset.</p>
                <p>Click this link to set a new password: <a href="${resetUrl}">${resetUrl}</a></p>
                <p>This link will expire in 1 hour.</p>
            `
        });

        res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error processing request.' });
    }
});

// 2. Reset Password (Verify Token & Update Password)
app.post('/api/reset-password', async (req, res) => {
    try {
        const User = require("./models/User");
        const { token, newPassword } = req.body;

        // Find user by token and ensure it hasn't expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt); // Change 'password' to whatever your field is named
        
        // Clear tokens
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// ==========================================
// DASHBOARD ROUTE
// ==========================================
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