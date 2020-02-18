var mysql = require('mysql');

/* var con = mysql.createConnection({
    pool: 10, //unsure how many of these we need, or if it helps at all
    host:"us-cdbr-iron-east-04.cleardb.net",
    user:"b8de33dafd8f78",
    password: "8c3c1fd8",
    database: "heroku_bba6983648ec3e9"
}) */

//may need to refactor api endpoints that require multiple queries if performance gets bad
//move datacreds to env variable in heroku
const con = mysql.createPool({
    connectionLimit: 25,
    host:"us-cdbr-iron-east-04.cleardb.net",
    user:"b8de33dafd8f78",
    password: "8c3c1fd8",
    database: "heroku_bba6983648ec3e9"
})

module.exports = con;
