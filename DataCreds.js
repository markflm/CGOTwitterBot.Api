const mysql = require('mysql');

// my sql connection
const db = mysql.createConnection(
    {
        host:"us-cdbr-iron-east-04.cleardb.net",
        user:"b8de33dafd8f78",
        password:"8c3c1fd8",
        database:"heroku_bba6983648ec3e9"

    }
);

module.exports = db; //allow other files like app.js to use this object