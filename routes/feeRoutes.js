const express = require("express");
const Fee = require("../models/Fee");
const Student = require("../models/Student");
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        const fee = await Fee.create(req.body);
        const student = await Student.findOne({
            studentId: req.body.studentId
        });
        if (student) {
            student.feesPaid =
                Number(student.feesPaid || 0) +
                Number(req.body.amount || 0);
            await student.save();
        }
        res.status(201).json(fee);
    } catch (e) {
        res.status(500).send("Error adding fee");
    }
});
router.get("/", async (req, res) => {
    try {
        const fees = await Fee.find().sort({ createdAt: -1 });
        res.json(fees);
    } catch (e) {
        res.status(500).send("Error getting fees");
    }
});
module.exports = router;