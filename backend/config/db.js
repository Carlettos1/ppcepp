const mysql = require('mysql');

const dbConfig = {
    host: "127.0.0.1",
    user: "admin",
    password: "1234",
    database: "login_system",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
};

// Use a connection pool
const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database.');
    connection.release();
});

// Handle MySQL connection errors
pool.on('error', (err) => {
    console.error('MySQL Pool Error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Attempting to reconnect...');
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) console.error('Error closing MySQL pool:', err);
        console.log('MySQL pool closed.');
        process.exit(0);
    });
});

module.exports = pool;
