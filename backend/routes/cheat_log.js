const express = require('express');
const db = require('../config/db');
/* cheat_log structure:
    id: int,
    user_id: int,
    action: int,
    context: string,
    timestamp: timestamp
*/
const recentLogs = new Map(); // Stores recent entries temporarily
const DUPLICATE_TIME_WINDOW = 100; // 100ms window
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

router.get('/all/named', (req, res) => {
    db.query('SELECT cheat_log.id, users.username as user_name, cheat_log.action as action, cheat_log.context as context, UNIX_TIMESTAMP(cheat_log.timestamp) as timestamp FROM cheat_log INNER JOIN users ON cheat_log.user_id = users.id ORDER BY cheat_log.timestamp DESC LIMIT 100', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
}
);

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
    const key = `${user_id}-${action}`;
    // Check if this entry was recently logged
    if (recentLogs.has(key)) {
        const lastTime = recentLogs.get(key);
        if (Date.now() - lastTime < DUPLICATE_TIME_WINDOW) {
            return res.status(200).json({ message: 'Duplicate entry ignored' });
        }
    }
    // Store the new log in memory
    recentLogs.set(key, Date.now());

    db.query('INSERT INTO cheat_log (user_id, action, context) VALUES (?, ?, ?)', [user_id, action, context], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Cheat log created' });
    });

    setTimeout(() => recentLogs.delete(key), DUPLICATE_TIME_WINDOW);
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

router.get("teacher/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT cheat_log.id, users.username as user_name, cheat_log.action as action, cheat_log.context as context, UNIX_TIMESTAMP(cheat_log.timestamp) as timestamp FROM cheat_log INNER JOIN users ON cheat_log.user_id = users.id WHERE users.teacher = ? ORDER BY cheat_log.timestamp DESC LIMIT 100", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(results)
    });
});

module.exports = router;