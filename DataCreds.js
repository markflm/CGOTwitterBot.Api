var mysql = require('mysql');

var con = mysql.createConnection({
    host:"us-cdbr-iron-east-04.cleardb.net",
    user:"b8de33dafd8f78",
    password: "8c3c1fd8",
    database: "heroku_bba6983648ec3e9"
})


module.exports = con