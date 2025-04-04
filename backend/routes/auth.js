const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// Registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log("registering: " + username)

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err, result) => {
                if (err) return res.status(400).json({ error: 'User already exists' });
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log("login: " + username)

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) {
            console.log(err);
            console.log(results);
            return res.status(400).json({ error: 'Invalid username or password 1' });
        }

        const user = results[0];
        /*
            user: {id, username, password, superuser}
        */
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password 2' });
        }

        const token = jwt.sign({ id: user.id, role: user.superuser }, 'your_secret_key', { expiresIn: '3h' });
        res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username } });
    });
});

router.get("/verify", (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        res.json({ message: 'Authorized', role: user.role, id: user.id });
    });
}
);

module.exports = router;
