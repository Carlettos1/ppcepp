const jwt = require('jsonwebtoken');
const db = require('../config/db');
const secret = require('../config/jwt');

// as a note, use it as:
// router.use(requirePrivilege(1)); for all the route
// router.get('/all', requirePrivilege(1), handler); for that specific endpoint

/// returns a function that checks whenever a user with a valid token can access a backend route
module.exports = function requirePrivilege(minimum = 1) {
    if (!Number.isInteger(minimum) || minimum < 0) {
        throw new TypeError('minimum privilege must be a non-negative integer');
    } //ok thanks AI i guess

    return (req, res, next) => {
        const header = req.headers.authorization;
        // safe extraction of header done by AI. ehm, whatever
        const token = typeof header === 'string' ? header.replace(/^Bearer\s+/i, '').trim() : '';
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let claims;
        try {
            claims = jwt.verify(token, secret, { algorithms: ['HS256'] });
        } catch (_) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!claims || !Number.isSafeInteger(claims.id) || claims.id <= 0) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        db.query('SELECT id, superuser FROM user WHERE id = ?', [claims.id], (err, rows) => {
            if (err) { return res.status(500).json({ error: 'Internal server error' }); }
            if (!rows.length) { return res.status(401).json({ error: 'Unauthorized' }); }
            const user = rows[0];
            if (!Number.isInteger(user.superuser) || user.superuser < minimum) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            req.user = user;
            next();
        });
    };
};
