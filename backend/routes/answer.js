const express = require('express');
const db = require('../config/db');
/* answer structure:
    id: int,
    question_id: int,
    user_id: int,
    answer: string
    grade: float
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
    db.query('SELECT answer.id, users.username as user_name, question.title as question, answer.answer as answer, answer.grade as grade FROM answer INNER JOIN users ON answer.user_id = users.id INNER JOIN question ON answer.question_id = question.id ORDER BY users.id DESC', (err, results) => {
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

// update grade
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { grade } = req.body;
    db.query('UPDATE answer SET grade = ? WHERE id = ?', [grade, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Grade updated' });
    });
});

router.get("/teacher/:id", (req, res) => {
    const { id } = req.params;
    //db.query("SELECT answer.id AS answer_id, answer.question_id, answer.user_id, users.username, answer.answer, answer.grade FROM answer JOIN users ON answer.user_id = users.id WHERE users.teacher = ?", [id], (err, results) => {
    db.query("SELECT answer.id, users.username as user_name, question.title as question, answer.answer as answer, answer.grade as grade FROM answer INNER JOIN users ON answer.user_id = users.id INNER JOIN question ON answer.question_id = question.id INNER JOIN teacher_question ON question.id = teacher_question.question_id WHERE teacher_question.teacher_id = ? AND users.teacher = ? ORDER BY users.id DESC", [id, id], (err, results) => {
        if (err) {
            console.log("Error:" + err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

module.exports = router;
