const express = require('express');
const db = require('../config/db');

const router = express.Router();

// get all users
router.get('/all', (req, res) => {
    db.query('SELECT id, username, superuser FROM users ORDER BY superuser DESC', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// delete question
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

module.exports = router;