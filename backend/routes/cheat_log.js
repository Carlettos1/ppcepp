const express = require('express');
const db = require('../config/db');
/* cheat_log structure:
    id: int,
    user_id: int,
    action: int,
    context: string,
    timestamp: timestamp
*/

const router = express.Router();

// get all cheat logs
router.get('/all', (req, res) => {
    db.query('SELECT * FROM cheat_log', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// get cheat log by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM cheat_log WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results[0]);
    });
});

// create cheat log
router.post('/', (req, res) => {
    const { user_id, action, context } = req.body;
    db.query('INSERT INTO cheat_log (user_id, action, context) VALUES (?, ?, ?)', [user_id, action, context], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Cheat log created' });
    });
});

// delete cheat log
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM cheat_log WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Cheat log deleted' });
    });
});

// get cheat logs by user_id
router.get('/user/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM cheat_log WHERE user_id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});
module.exports = router;