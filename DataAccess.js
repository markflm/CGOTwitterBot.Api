const database = require('./DataCreds.js');
const mysql = require('mysql');


 const getTeams = (playerName) => {
  database.query("SELECT * FROM UserTeams WHERE UserName = ?", playerName, (err, result, fields) => {
    if (err) throw err;
    else return result;
})}



 const addTeams = (playerName) => {
     console.log(playerName)
     return
 } 
exports.getTeams = getTeams; //allow other files like app.js to use this object
exports.addTeams = addTeams;