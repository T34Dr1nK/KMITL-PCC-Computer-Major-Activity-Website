require("dotenv").config();
const mysql = require("mysql2/promise");

const dbuser = process.env.dbuser;
const dbpassword = process.env.dbpassword;
const dbname = process.env.dbname;

// XAMPP
const pool = mysql.createPool({
    host: "mysql",
    user: dbuser,
    password: dbpassword,
    database: dbname,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})
module.exports = pool;