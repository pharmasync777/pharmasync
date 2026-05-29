const mysql = require('mysql2');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Railway MySQL butuh SSL
    ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost'
        ? { rejectUnauthorized: false }
        : false
});

const promisePool = pool.promise();

module.exports = promisePool;
