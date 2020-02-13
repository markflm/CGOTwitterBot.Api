//'npm start' has been set to run project with nodemon server
//TODO: fillout server.js; set up get and post methods; configure database credentials
const express = require('express');
const app = express(); //spins up express application
const morgan = require('morgan'); //logging backage
const bodyPaser = require('body-parser');
const dbConn = require('./DataCreds.js');
const dataAccess = require('./DataAccess.js');
const mysql = require('mysql');

dbConn.connect((err) => {
    if(err){
        console.log('db error')
    }
    else{
        console.log('db success')
    }
})

app.use(morgan('dev'));


app.get('/:player/getteams', (req, res, next) => {
var playerName = req.params.player

dbConn.query("SELECT * FROM UserTeams WHERE UserName = ?", playerName, (err, result, fields) => {
    if (err) throw err;
    
    var teamList = result.map(jsonifyTeams)

console.log(teamList)

res.status(200).json({
    message: "teams returned",
    player: playerName,
    teams: teamList
})

}
)})

function jsonifyTeams(item){
    var teamName = item.Team
    return teamName
}


module.exports = app;