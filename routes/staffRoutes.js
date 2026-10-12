const express = require("express");
const Staff = require("../models/Staff");
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        const staff = await Staff.create(req.body);
        res.status(201).json(staff);
    } catch (e) {
        res.status(500).send("Error adding staff");
    }
});
router.get("/", async (req, res) => {
    try {
        const staff = await Staff.find().sort({ createdAt: -1 });
        res.json(staff);
    } catch (e) {
        res.status(500).send("Error getting staff");
    }
});
module.exports = router;