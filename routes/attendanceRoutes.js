const express = require("express");
const Attendance = require("../models/Attendance");
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        const attendance = await Attendance.create(req.body);
        res.status(201).json(attendance);
    } catch (e) {
        res.status(500).send("Error saving attendance");
    }
});
router.get("/", async (req, res) => {
    try {
        const attendance = await Attendance
            .find()
            .sort({ date: -1 });
        res.json(attendance);
    } catch (e) {
        res.status(500).send("Error getting attendance");
    }
});
module.exports = router;