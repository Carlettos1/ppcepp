const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get("/all", (req, res) => {
    db.query("SELECT exam_time.teacher_id, user.username, exam_time.start_time, exam_time.end_time FROM exam_time INNER JOIN user ON exam_time.teacher_id = user.id ORDER BY user.id DESC", [], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// get start_time and end_time of the given teacher's exam
router.get('/:teacher_id', (req, res) => {
    const { teacher_id } = req.params;
    db.query("SELECT * FROM exam_time WHERE teacher_id = ?", [teacher_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// set start_time and end_time of the given teacher's exam
router.post("/:teacher_id", (req, res) => {
    // if the entry exists in the database, then update, if not, create it.
    const { start_time, end_time } = req.body;
    const { teacher_id } = req.params;
    db.query("SELECT * FROM exam_time WHERE teacher_id = ?", [teacher_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            // create entry
            db.query("INSERT INTO exam_time (teacher_id, start_time, end_time) VALUES (?, ?, ?)", [teacher_id, start_time, end_time], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                return res.json({ message: "ok" });
            });
        } else {
            // update entry
            db.query("UPDATE exam_time SET start_time = ?, end_time = ? WHERE teacher_id = ?", [start_time, end_time, teacher_id], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                return res.json({ message: "ok" });
            });
        }
    });
});

router.patch("/start/:teacher_id", (req, res) => {
    const { start_time } = req.body;
    const { teacher_id } = req.params;
    db.query("UPDATE exam_time SET start_time = ? WHERE teacher_id = ?", [start_time, teacher_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json({ message: "ok" });
    });
});

router.patch("/end/:teacher_id", (req, res) => {
    const { end_time } = req.body;
    const { teacher_id } = req.params;
    db.query("UPDATE exam_time SET end_time = ? WHERE teacher_id = ?", [end_time, teacher_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json({ message: "ok" });
    });
});

module.exports = router;