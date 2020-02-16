//'npm start' has been set to run project with nodemon server
const express = require('express');
const app = express(); //spins up express application
const morgan = require('morgan'); //logging package
const bodyPaser = require('body-parser');
const dbConn = require('./DataCreds.js');
const teamRoutes = require('./API/Routes/teams.js')



/* dbConn.connect((err) => {
    if(err){
        console.log('db error')
    }
    else{
        console.log('db success')
    }
}) */

app.use(morgan('dev'));

app.use(bodyPaser.urlencoded({extended:false})); //extended = 'rich text'. only want basic for now.
app.use(bodyPaser.json()); //interprets incoming JSON data; put it right into an object without having to manually parse

app.use('/teams', teamRoutes) //route requests to /teams to the teams.js file

//response to "!teams" command, returns all teams a user is currently subscribed to
app.get('/user/:user/getteams', (req, res, next) => {
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
//requires: one JSON object with a teamsToAdd key with value(s) in a string array
app.post('/user/:user/addteams',(req, res, next) => {
    var userName = req.params.user
    var teamsToAdd = req.body.teamsToAdd;

    var teamList = []; //teams already existing for user in database

    //logic to check if the teams to be added are already in the database for this user
dbConn.query("SELECT * FROM UserTeams WHERE UserName = ?", userName, (err, result, fields) => {
    if (err) throw err;
        
    teamList = result.map(jsonifyTeams)

    //console.log(teamList) //teams user already has in database[]
    var teamsToInsert = teamsToAdd.filter(x => !teamList.includes(x))
 
    //if there are new teams to add, create an INSERT statement
 if (teamsToInsert.length > 0) {   

    var insertQueryText = 'INSERT INTO userteams (UserName, Team) VALUES '

    //concat insert string together
    for(i = 0; i < teamsToInsert.length; i++){

        insertQueryText += "('" + userName + "','" + teamsToInsert[i] + "'),"
    
    }

    //remove last comma for valid sql syntax
    insertQueryText = insertQueryText.substr(0, insertQueryText.length - 1 )
    //console.log(insertQueryText) //final insert query string being sent
    dbConn.query(insertQueryText, (err, result, fields) => {
        if (err) throw err;
        res.status(201).json({
            message: "Teams added successfully for " + userName,
            teamsAdded: teamsToInsert
     })
 }) }
 else{
     res.status(202).json({
         message:"User " + userName + " is already tracking all of these teams",
         teamsPresent: teamsToAdd
         })
    }

    })
     

})


//resposne to the "-[team]" command
//requires: one JSON object with a teamsToRemove key with value(s) in a string array
app.post('/user/:user/removeteams',(req, res, next) => {
    var userName = req.params.user;
    var teamsToRemove = req.body.teamsToRemove;


var deleteString = ""
for(i = 0; i < teamsToRemove.length;i++){
    deleteString += "'" +teamsToRemove[i] + "',"
}

deleteString = deleteString.substr(0, deleteString.length - 1)


    //todo: add response for when team isn't in users list
    dbConn.query("DELETE FROM userteams WHERE team IN (" + deleteString + ") AND UserName = ?", userName, (err, result, fields) => {
        if (err) throw err;
        console.log(result)
    })
    res.status(201).json({
        message:"Teams deleted successfully for " + userName,
        //teams: teamsToRemove //may need to do a 'get teams' on user to determine which teams were already in db for them, then return actual teams deleted
    })
})

//for use with .map on the array of json objects returned by mysql select. should probably make this an arrow function.
function jsonifyTeams(item){
    var teamName = item.Team
    return teamName
}


module.exports = app;
