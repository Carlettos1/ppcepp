const express = require('express');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const router = express.Router();

/// Get all answers based on the auth token
/// Returns if the user has submitted the exam or not by checking if there is an entry on the answer table with the id decripted from the token
router.get('/', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        
        db.query('SELECT * FROM answer WHERE user_id = ?', [user.id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                res.json({ submitted: false });
            } else {
                res.json({ submitted: true });
            }
        });
    });
});

/// Submit the answer using the auth token
router.post('/', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        console.log(user.id + ": " + req.body);
        const { question_id, answer } = req.body;
        db.query('INSERT INTO answer (question_id, user_id, answer) VALUES (?, ?, ?)', [question_id, user.id, answer], (err, results) => {
            if (err) {
                console.error(user.id + ": " + err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: 'Answer submitted successfully' });
        });
    });
});

module.exports = router;