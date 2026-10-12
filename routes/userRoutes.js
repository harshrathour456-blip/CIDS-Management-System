const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (await User.findOne({ email })) {
            return res.status(400).send("Email already registered");
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashed,
            role: role || "staff"
        });
        res.json({
            message: "User registered",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (e) {
        res.status(500).send("Registration error");
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send("Wrong password");
        }
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (e) {
        res.status(500).send("Login error");
    }
});
module.exports = router;