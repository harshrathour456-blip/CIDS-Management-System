const express = require("express");
const Course = require("../models/Course");
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (e) {
        res.status(500).send("Error adding course");
    }
});
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json(courses);
    } catch (e) {
        res.status(500).send("Error getting courses");
    }
});
module.exports = router;