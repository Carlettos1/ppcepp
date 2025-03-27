const mysql = require('mysql');

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "admin",
    password: "1234",
    database: "login_system",
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

module.exports = db;
