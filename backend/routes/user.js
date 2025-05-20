const express = require('express');
const db = require('../config/db');

const router = express.Router();

// get all users
router.get('/all', (req, res) => {
    db.query('SELECT id, username, superuser, teacher as teacher_id FROM users ORDER BY superuser DESC, teacher_id DESC, id DESC', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// get all users by teacher_id
router.get('/teacher/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT id, username, superuser, teacher as teacher_id FROM users WHERE teacher = ? ORDER BY superuser DESC, teacher_id DESC, id DESC', [id], (err, results) => {
        res.json(results);
    });
});

// delete 
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'User deleted' });
    });
});

router.put("/upgrade/:id", (req, res) => {
    const { id } = req.params;
    db.query("UPDATE users SET superuser = superuser + 1 WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json({ message: "User upgraded" });
    });
});

router.put("/downgrade/:id", (req, res) => {
    const { id } = req.params;
    db.query("UPDATE users SET superuser = superuser - 1 WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json({ message: "User upgraded" });
    });
});

// Update teacher_id
router.put("/teacher/:id", (req, res) => {
    const { id } = req.params;
    const { teacher_id } = req.body;
    db.query("UPDATE users SET teacher = ? WHERE id = ?", [teacher_id, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json({ message: "Teacher updated" });
    });
});

// Remove teacher association
router.put("/remove-teacher/:id", (req, res) => {
    const { id } = req.params;
    db.query("UPDATE users SET teacher = NULL WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json({ message: "Teacher association removed" });
    });
});

module.exports = router;