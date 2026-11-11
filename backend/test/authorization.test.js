const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
process.env.JWT_SECRET = 'test-only-secret-not-for-deployment-123456789';
const jwt = require('jsonwebtoken');
const express = require('express');
let role = 1;
let deleted = false;
let failure = false;
let queries = [];
const db = { query(sql, params, callback) {
    queries.push(sql);
    if (typeof params === 'function') callback = params;
    if (sql === 'SELECT id, superuser FROM user WHERE id = ?') {
        return callback(failure ? new Error('offline') : null, deleted ? [] : [{ id: 7, superuser: role }]);
    }
    callback(null, []);
} };
require.cache[require.resolve('../config/db')] = { exports: db };
const guard = require('../middleware/requirePrivilege');
const app = express();
app.get('/guard', guard(1), (req, res) => res.json(req.user));
for (const name of ['answer', 'user', 'question', 'exam_time', 'teacher_question', 'cheat_log']) {
    app.use('/' + name, require('../routes/' + name));
}
const token = (claims = { id: 7, role: 2 }, options = {}) => jwt.sign(claims, process.env.JWT_SECRET, { expiresIn: '1h', ...options });

test('authorization and router boundaries', async (t) => {
    const server = http.createServer(app);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    async function request(path, authorization, method = 'GET') {
        queries = [];
        return new Promise((resolve, reject) => {
            const req = http.request({ host: '127.0.0.1', port: server.address().port, path, method,
                headers: authorization ? { authorization } : {} }, res => {
                res.resume();
                res.on('end', () => resolve(res.statusCode));
            });
            req.on('error', reject);
            req.end();
        });
    }
    for (const auth of [undefined, 'garbage', token({}, {}), token({ id: 7 }, { expiresIn: -1 }),
        jwt.sign({ id: 7 }, 'wrong-secret'), token({ id: { injected: true } })]) {
        assert.equal(await request('/guard', auth), 401);
        assert.equal(queries.length, 0);
    }
    for (const level of [0, -1, null, '1']) {
        role = level;
        assert.equal(await request('/guard', token()), 403);
    }
    for (const level of [1, 2]) {
        role = level;
        assert.equal(await request('/guard', token({ id: 7, role: 0 })), 200);
        assert.equal(await request('/guard', 'Bearer ' + token()), 200);
    }
    deleted = true;
    assert.equal(await request('/guard', token()), 401);
    deleted = false;
    failure = true;
    assert.equal(await request('/guard', token()), 500);
    failure = false;
    role = 0;
    const protectedRoutes = [
        ['/answer/all'], ['/answer/all/named'], ['/answer/7'], ['/answer/user/7'],
        ['/answer/question/7'], ['/answer/teacher/7'], ['/answer/7', 'PUT'], ['/answer/7', 'DELETE'],
        ['/user/all'], ['/user/teacher/7'], ['/user/upgrade/7', 'PUT'], ['/user/downgrade/7', 'PUT'],
        ['/question/all'], ['/question/7', 'PUT'], ['/question/', 'POST'], ['/question/7', 'DELETE'],
        ['/exam_time/all'], ['/exam_time/7', 'POST'], ['/exam_time/start/7', 'PATCH'],
        ['/teacher_question/7'], ['/teacher_question/', 'POST'], ['/teacher_question/7/7', 'DELETE'],
        ['/cheat_log/all'], ['/cheat_log/all/named'], ['/cheat_log/7'], ['/cheat_log/user/7'],
        ['/cheat_log/teacher/7'], ['/cheat_log/7', 'DELETE']
    ];
    for (const [path, method] of protectedRoutes) {
        assert.equal(await request(path, undefined, method), 401, path);
        assert.equal(queries.length, 0, path);
        assert.equal(await request(path, token(), method), 403, path);
        assert.equal(queries.length, 1, path);
    }
    role = 1;
    assert.equal(await request('/answer/all', token()), 200);
    for (const [path, method] of [['/user/upgrade/7', 'PUT'], ['/user/downgrade/7', 'PUT'], ['/user/7', 'DELETE']]) {
        assert.equal(await request(path, token(), method), 403);
        assert.ok(queries.every(sql => sql.startsWith('SELECT id, superuser')));
    }
    role = 2;
    assert.equal(await request('/user/upgrade/7', token(), 'PUT'), 200);
    role = 0;
    assert.equal(await request('/question/teacher/7', token()), 200);
    assert.equal(await request('/exam_time/7', token()), 200);
});
