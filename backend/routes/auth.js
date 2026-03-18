const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// if no user exist, add default admin
db.query('SELECT id, username, superuser, teacher as teacher_id FROM user ORDER BY superuser DESC, teacher_id DESC, id DESC', (err, results) => {
    if (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
        console.log("No users, creating default user `admin`, with pass `admin`");
        const username = "admin";
        const password = "admin";
        const superuser = 2;
        const teacher_id = 0;

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error("Admin password hashing error: ", err);
                console.error("not really know what to do in this scenario,,,");
                throw new Error("Default admin password hashing error");
            }
            db.query('INSERT INTO user (username, password, teacher, superuser) VALUES (?, ?, ?, ?)',
                [username, hash, teacher_id, superuser],
                (err, _results) => {
                    if (err) {
                        console.error("Database error during admin registration:", err);
                        console.error("again, not really what to do in this case,,,,");
                        throw new Error("Default admin database query error");
                    }
                    console.log("Admin created, default password: ", password);
                }
            );
        });
    }
});


// Registration
router.post('/register', (req, res) => {
    const { username, password, teacher_id } = req.body;
    const hashedPassword = bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error("Password hashing error:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        db.query('INSERT INTO user (username, password, teacher) VALUES (?, ?, ?)',
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

router.post('/mass-register', (req, res) => {
    const users = req.body.users;
    const token = req.headers['authorization'];

    if (!token) { return res.status(401).json({ error: 'Unauthorized' }); }
    jwt.verify(token, 'your_secret_key', (err, _user) => {
        if (err) { return res.status(403).json({ error: 'Forbidden' }); }

        const teacher = users[0];
        console.log(users);
        console.log(teacher);
        db.query("INSERT INTO user (username, password, superuser) VALUES (?, ?, ?)", [teacher.email, bcrypt.hashSync(teacher.rut, 10), "1"], (err, _result) => {
            if (err) {
                console.error("Couldn't register teacher: ", teacher.email, teacher.rut);
                console.error("Database error:", err);
            }
            db.query("SELECT id FROM user WHERE username = ?", [teacher.email], (err, result) => {
                if (err) {
                    console.error("Couldn't get teacher: ", teacher.email, teacher.rut);
                    console.error("Database error:", err);
                    return;
                }
                const teacher_id = result[0].id;
                for (let i = 1; i < users.length; i++) {
                    const user = users[i];
                    db.query("INSERT INTO user (username, password, teacher) VALUES (?, ?, ?)", [user.email, bcrypt.hashSync(user.rut, 10), teacher_id], (err, _res) => {
                        if (err) {
                            console.error("Couldn't register user: ", user.email, user.rut);
                            console.error("Database error:", err);
                        }
                    });
                }
            });
        });
        return res.json({ message: "Ok" });
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

    db.query('SELECT * FROM user WHERE username = ?', [username], async (err, results) => {
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
        db.query('SELECT * FROM user WHERE id = ?', [user.id], (err, results) => {
            if (err) return res.status(400).json({ error: 'Internal server error' });
            res.json({ message: 'Authorized', role: results[0].superuser, id: user.id, name: results[0].username, teacher: results[0].teacher, isAdmin: user.role > 0 });
        });
    });
});

module.exports = router;
