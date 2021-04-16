var mysql = require('mysql');

//may need to refactor api endpoints that require multiple queries if performance gets bad
const con = mysql.createPool({
    connectionLimit: process.env.mySqlConnLimit,
    host: process.env.mySqlHost,
    user: process.env.mySqlUser,
    password: process.env.mySqlPassword,
    database: process.env.mySqlDatabase,
    acquireTimeout: 1000000
})

module.exports = con;
