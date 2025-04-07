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
router.post('/register', async (req, res) => {
    var { username, password, teacher } = req.body;
    if (!teacher) {
        teacher = 2;
    }
    console.log("registering: " + username)

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO users (username, password, teacher) VALUES (?, ?, ?)',
            [username, hashedPassword, teacher],
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
