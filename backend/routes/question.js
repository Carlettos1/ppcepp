const express = require('express');
const db = require('../config/db');
/* question architecture:
    id: int
    title: string
    question: string
    example: string
    created_at: timestamp
    updated_at: timestamp
*/

const router = express.Router();

// get all questions
router.get('/all', (req, res) => {
    db.query('SELECT * FROM question', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// get question by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM question WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results[0]);
    });
});

// modify question
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, question, example } = req.body;
    db.query('UPDATE question SET title = ?, question = ?, example = ? WHERE id = ?', [title, question, example, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Question updated' });
    });
});

// create question
router.post('/', (req, res) => {
    const { title, question, example } = req.body;
    db.query('INSERT INTO question (title, question, example) VALUES (?, ?, ?)', [title, question, example], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Question created' });
    });
});

// delete question
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM question WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Question deleted' });
    });
});

module.exports = router;