const mysql = require('mysql');

let db;

const dbConfig = {
    host: "127.0.0.1",
    user: "admin",
    password: "1234",
    database: "login_system",
};

function connect() {
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL database:', err);
            setTimeout(connect, 2000); // Retry connection after 2 seconds
        } else {
            console.log('Connected to MySQL database.');
        }
    });

    db.on('error', (err) => {
        console.error('MySQL error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            db.destroy();
            console.error('Reconnecting to MySQL database...');
            connect(); // Reconnect if connection is lost
        } else {
            throw err; // Handle other errors
        }
    });
}

connect();

module.exports = db;
