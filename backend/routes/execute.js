const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/db');

router.post('/', (req, res) => {
    // If no question_id is provided, execute code directly (playground mode)
    if (!req.body.question_id) {
        axios.post('http://127.0.0.1:5000/execute', { code: req.body.code })
            .then((response) => {
                res.status(response.status).json(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    res.status(error.response.status).json(error.response.data);
                } else {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });
        return;
    }

    // Question mode - get prepend code from database
    db.query("SELECT prepend FROM question WHERE id = ?", [req.body.question_id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Question not found' });
            return;
        }
        const prepend = results[0].prepend;
        req.body.code = prepend + "\n" + req.body.code;

        axios.post('http://127.0.0.1:5000/execute', { code: req.body.code })
            .then((response) => {
                res.status(response.status).json(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    res.status(error.response.status).json(error.response.data);
                } else {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });
    });
});

module.exports = router;