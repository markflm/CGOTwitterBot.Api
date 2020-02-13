//'npm start' has been set to run project with nodemon server
//TODO: fillout server.js; set up get and post methods; configure database credentials
const express = require('express');
const app = express(); //spins up express application
const morgan = require('morgan'); //logging package
const bodyPaser = require('body-parser');
const dbConn = require('./DataCreds.js');
const dataAccess = require('./DataAccess.js');

dbConn.connect((err) => {
    if(err){
        console.log('db error')
    }
    else{
        console.log('db success')
    }
})

app.use(morgan('dev'));

app.use(bodyPaser.urlencoded({extended:false})); //extended = 'rich text'. only want basic for now.
app.use(bodyPaser.json()); //interprets incoming JSON data; put it right into an object without having to manually parse


//response to "!teams" command, returns all teams a user is currently subscribed to
app.get('/:user/getteams', (req, res, next) => {
var userName = req.params.user

dbConn.query("SELECT * FROM UserTeams WHERE UserName = ?", userName, (err, result, fields) => {
    if (err) throw err;
    
    var teamList = result.map(jsonifyTeams)

res.status(200).json({
    message: "teams returned",
    user: userName,
    teams: teamList
})

}
)})

//response to the "+[team]" command, adds incoming teams to the database for that user if they do not already exist.
app.post('/:user/addteams',(req, res, next) => {
    var userName = req.params.user
    var teamsToAdd = req.body.teamsToAdd;

    //logic to check if the teams to be added are already in the database for this user

    //logic that creates an INSERT statement that adds all these teams to the database

    res.status(201).json({
        message:"teams added successfully for " + userName,
        teams: teamsToAdd
    })

})

//for use with .map on the array of json objects returned by mysql select. should probably make this an arrow function.
function jsonifyTeams(item){
    var teamName = item.Team
    return teamName
}


module.exports = app;