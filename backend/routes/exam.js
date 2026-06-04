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
            // result = {id, question_id, user_id, answer, grade}
            // get user teacher id
            db.query('SELECT teacher FROM user WHERE id = ?', [user.id], (err, teacherResults) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                // teacherResults = {teacher}
                const teacherId = teacherResults[0].teacher;

                // get all assigned questions for the teacher
                db.query('SELECT question_id FROM teacher_question WHERE teacher_id = ?', [teacherId], (err, assignedQuestions) => {
                    if (err) {
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    // assignedQuestions = [{question_id}, {question_id}, ...]

                    // filter results to only include submitted answers that are in the assigned questions
                    const submittedAnswers = results.filter(answer =>
                        assignedQuestions.some(q => q.question_id === answer.question_id && answer.submitted)
                    );

                    if (submittedAnswers.length > 0) {
                        res.json({ submitted: true, answers: submittedAnswers });
                    } else {
                        res.json({ submitted: false, answers: [] });
                    }
                });
            });
        });
    });
});

/// Submit the answer using the auth token
router.post('/submit', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        const { question_id, answer } = req.body;
        console.log("Entregando prueba de: " + user.id + ": " + question_id);
        db.query("SELECT id, submitted FROM answer WHERE question_id = ? AND user_id = ?", [question_id, user.id], (err1, res1) => {
            if (err1) {
                console.error("Error al entregar la prueba de " + user.id + ": " + err);
                console.log(answer);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // no other just insert.
            if (res1.length === 0) {
                db.query('INSERT INTO answer (question_id, user_id, answer, submitted) VALUES (?, ?, ?, ?)', [question_id, user.id, answer, 1], (err, results) => {
                    if (err) {
                        console.error("Error al entregar la prueba de " + user.id + ": " + err);
                        console.log(answer);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    return res.json({ message: 'Answer submitted successfully' });
                });
            } else {
                const first = res1[0];

                if (first.submitted) {
                    // Already submitted, response with error.
                    return res.status(409).json({ error: 'Answer already submitted' });
                }

                // update existing non-submitted answer with provided text
                db.query(
                    "UPDATE answer SET answer = ?, submitted = 1 WHERE id = ?",
                    [answer, first.id],
                    (err2) => {
                        if (err2) {
                            console.error("Error al entregar la prueba de " + user.id + ": " + err);
                            console.log(answer);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        return res.json({ message: 'Answer submitted successfully' });
                    }
                );
            }
        });
    });
});

/// Autosave the answer using the auth token
router.post('/autosave', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        const { question_id, answer } = req.body;

        db.query("SELECT id, submitted FROM answer WHERE question_id = ? AND user_id = ?", [question_id, user.id], (err1, res1) => {
            if (err1) {
                console.error("Autosave error for user " + user.id + ": " + err1);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (res1.length === 0) {
                // no question_id, user_id, create one.
                db.query(
                    "INSERT INTO answer (question_id, user_id, answer) VALUES (?, ?, ?)",
                    [question_id, user.id, answer],
                    (err2, res2) => {
                        if (err2) {
                            console.error(`Autosave INSERT error for user ${user.id}:`, err2);
                            return res.status(500).json({ error: 'Internal server error' });
                        }

                        return res.json({
                            success: true,
                            id: res2.insertId,
                            created: true
                        });
                    }
                );
            } else {
                // treat first as unique, log if more than 1
                if (res1.length > 1) {
                    console.warn(
                        `Autosave SELECT returned ${res1.length} rows for question_id=${question_id}, user_id=${user.id}`
                    );
                }
                const first = res1[0];

                if (first.submitted) {
                    // Already submitted, response with error-non-error.
                    return res.json({ error: 'Answer already submitted' });
                }

                // update existing non-submitted answer with provided text
                db.query(
                    "UPDATE answer SET answer = ? WHERE id = ?",
                    [answer, first.id],
                    (err2) => {
                        if (err2) {
                            console.error(`Autosave UPDATE error for user ${user.id}:`, err2);
                            return res.status(500).json({ error: 'Internal server error' });
                        }

                        return res.json({
                            success: true,
                            id: first.id,
                            updated: true
                        });
                    }
                );
            }
        });
    });
});

module.exports = router;
