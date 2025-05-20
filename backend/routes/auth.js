const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

/* 
* martes: 12:10-14:00 fabrizzio (67)
* martes: 14:00-16:00 cata, clau (28, 51)
* mierco: 12:10-14:00 carlos, yas (91, 131)
*/

// Registration
router.post('/register', (req, res) => {
    const { username, password, teacher_id } = req.body;
    const hashedPassword = bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error("Password hashing error:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        db.query('INSERT INTO users (username, password, teacher) VALUES (?, ?, ?)', 
            [username, hash, teacher_id], 
            (err, results) => {
                if (err) {
                    console.error("Database error during registration:", err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.json({ message: 'User registered successfully' });
            }
        );
    });
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt received:", { username, passwordLength: password?.length });

    if (!username || !password) {
        console.log("Missing username or password");
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(400).json({ error: 'Invalid username or password 1' });
        }
        
        if (results.length === 0) {
            console.log("No user found with username:", username);
            return res.status(400).json({ error: 'Invalid username or password 1' });
        }

        const user = results[0];
        console.log("User found:", { 
            id: user.id, 
            username: user.username, 
            teacher: user.teacher,
            superuser: user.superuser 
        });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password validation result:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password 2' });
        }

        if (false) { // disable and implement them on the db later
            const now = new Date();
            const time_67 = new Date("2025-04-08T12:00:00.000-04:00");
            const time_28 = new Date("2025-04-08T14:00:00.000-04:00");
            const time_91 = new Date("2025-04-09T12:00:00.000-04:00");

            if (user.teacher == 67) {
                const difference = now.getTime() - time_67.getTime();
                if (difference < 0 || difference >= 2*60*60*1000) {
                    return res.status(400).json({ error: "Tiempo de ingreso inválido" });
                }
            }

            if (user.teacher == 28 || user.teacher == 51) {
                const difference = now.getTime() - time_28.getTime();
                if (difference < 0 || difference >= 2*60*60*1000) {
                    return res.status(400).json({ error: "Tiempo de ingreso inválido" });
                }
            }

            if (user.teacher == 91 || user.teacher == 131) {
                const difference = now.getTime() - time_91.getTime();
                if (difference < 0 || difference >= 2*60*60*1000) {
                    return res.status(400).json({ error: "Tiempo de ingreso inválido" });
                }
            }
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

// returns all info about user (except password), it requires a token
router.get("/info", (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        db.query('SELECT * FROM users WHERE id = ?', [user.id], (err, results) => {
            if (err) return res.status(400).json({ error: 'Internal server error' });
            res.json({ message: 'Authorized', role: user.role, id: user.id, name: results[0].username, teacher: results[0].teacher, isAdmin: user.role > 0 });
        });
    });
});

module.exports = router;
