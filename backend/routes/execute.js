const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', (req, res) => {
    axios.post('http://127.0.0.1:5000/execute', req.body).then((response) => {
        res.status(response.status).json(response.data);
    }).catch((error) => {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

module.exports = router;