const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Create new assignment
router.post('/', (req, res) => {
    const { teacher_id, question_id } = req.body;
    db.query('INSERT INTO teacher_question (teacher_id, question_id) VALUES (?, ?)', 
        [teacher_id, question_id], 
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: 'Question assigned successfully' });
        }
    );
});

// Delete assignment
router.delete('/:teacher_id/:question_id', (req, res) => {
    const { teacher_id, question_id } = req.params;
    db.query('DELETE FROM teacher_question WHERE teacher_id = ? AND question_id = ?', 
        [teacher_id, question_id], 
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: 'Question unassigned successfully' });
        }
    );
});

// Get all assignments for a teacher
router.get('/:teacher_id', (req, res) => {
    const { teacher_id } = req.params;
    db.query(`
        SELECT q.* 
        FROM question q
        INNER JOIN teacher_question tq ON q.id = tq.question_id
        WHERE tq.teacher_id = ?
    `, [teacher_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

module.exports = router; 