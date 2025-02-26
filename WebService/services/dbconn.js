const mysql = require("mysql2");

// XAMPP
const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "password",
    database: "my_database"
})

module.exports = connection;