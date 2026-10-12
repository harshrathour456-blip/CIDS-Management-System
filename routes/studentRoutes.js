const express = require("express");
const Student = require("../models/Student");
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (e) {
        res.status(500).send("Error adding student");
    }
});
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (e) {
        res.status(500).send("Error getting students");
    }
});
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send("Student not found");
        }
        res.json(student);
    } catch (e) {
        res.status(500).send("Error");
    }
});
router.put("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(student);
    } catch (e) {
        res.status(500).send("Update error");
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.send("Student deleted");
    } catch (e) {
        res.status(500).send("Delete error");
    }
});
module.exports = router;
