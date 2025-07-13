// src/lib/db/mariadb.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const poolMain = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MAIN_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const poolAuth = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_AUTH_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export { poolMain, poolAuth };
