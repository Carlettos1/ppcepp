const express = require('express');
const db = require('../config/db');
/* answer structure:
    id: int,
    question_id: int,
    user_id: int,
    answer: string
*/

const router = express.Router();

// get all answers
router.get('/all', (req, res) => {
    db.query('SELECT * FROM answer', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

router.get('/all/named', (req, res) => {
    db.query('SELECT answer.id, users.username as user_name, question.title as question, answer.answer as answer FROM answer INNER JOIN users ON answer.user_id = users.id INNER JOIN question ON answer.question_id = question.id', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});


// get answer by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM answer WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results[0]);
    });
});

// get answers by user_id
router.get('/user/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM answer WHERE user_id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// get answers by question_id
router.get('/question/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM answer WHERE question_id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// create answer
router.post('/', (req, res) => {
    const { question_id, user_id, answer } = req.body;
    db.query('INSERT INTO answer (question_id, user_id, answer) VALUES (?, ?, ?)', [question_id, user_id, answer], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Answer created' });
    });
});

// delete answer
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM answer WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Answer deleted' });
    });
});

module.exports = router;