//'npm start' has been set to run project with nodemon server
const express = require('express');
const app = express(); //spins up express application
const morgan = require('morgan'); //logging package
const bodyPaser = require('body-parser');
const dbConn = require('./DataCreds.js');
const teamRoutes = require('./API/Routes/teams.js');
const apiCreds = require('./API/apiKey.js');
const crud = require('./crud.js');



app.use(morgan('dev'));

app.use(bodyPaser.urlencoded({extended:false})); //extended = 'rich text'. only want basic for now.
app.use(bodyPaser.json()); //interprets incoming JSON data; put it right into an object without having to manually parse

app.use( (req, res, next) => { //valid api key before doing anything else with request
    var requestValid = apiCreds(req.headers['apikey']);

    if(!requestValid){
        res.status(401).json({
            message:"apiKey invalid"
        })
        return
    }
    next();
})

app.use('/teams', teamRoutes) //route requests to /teams to the teams.js file



//response to "!teams" command, returns all teams a user is currently subscribed to
app.get('/user/:user/getteams', (req, res, next) => {

var userName = req?.params?.user

crud.getTeams(userName)
.then((result) => {

    let usersTeams = result
    res.status(200).json({
        message: "teams returned",
        user: userName,
        teams: usersTeams.map(jsonifyTeams)
    })
})

})


//response to the "+[team]" command, adds incoming teams to the database for that user if they do not already exist.
//requires: one JSON object with a teamsToAdd key with value(s) in a string array OR {Team:, HltvId:} object
app.post('/user/:user/addteams',(req, res, next) => {


    var userName = req?.params?.user
    var teamsToAdd = req?.body?.teamsToAdd;

    let teamList = teamsToAdd.map(jsonifyTeamsDetailed)
    var teamsValidated = req?.headers['requiredvalidation'] //if header exists and is true - it's confirmed these teams are real, new and the user is not currently subscribed to them

if(!teamsValidated){

crud.getTeams(userName)
.then((result) => {

    let subbedTeams = result.map(jsonifyTeamsDetailed);
    let subbedTeamString = result.map(jsonifyTeams);
    let newTeams = teamList.filter(x => !subbedTeamString.includes(x.Team))

    if(newTeams.length == 0){ //if user subbed to all teams already, return 406
        res.status(406)
        .json({confirmedMessage:"User: "+ userName +" subscribed to all provided teams already",
               teamsConfirmedAdded:"",
               unconfirmedMessage:"",
               teamsUnconfirmed:""
              }) 
        return
    }


    crud.doesTeamExist(newTeams)
    .then((result) => {

        let realTeams = result.map(jsonifyTeamsDetailed);
        let realTeamsString = result.map(jsonifyTeams);
        let unconfirmedTeams = newTeams.filter(x => !realTeamsString.includes(x.Team))

        if(realTeams.length == 0){ //if no confirmed teams, return
            res.status(201).json({
                confirmedMessage:"Teams that were confirmed to exist and added for " + userName,
                teamsConfirmedAndAdded: "",
                unconfirmedMessage:"Teams that could not be confirmed to exist",
                teamsUnconfirmed: unconfirmedTeams
            })
            return

        }
        
        
        crud.addTeams(userName, realTeams)
            .then(_ => {
                if(newTeams?.length > realTeams?.length ){
                    
                    console.log("There are teams in this Add request that could not be confirmed to exist: " + unconfirmedTeams)
                }
                res.status(201).json({
                    confirmedMessage:"Teams that were confirmed to exist and added for " + userName,
                    teamsConfirmedAndAdded: realTeams ?? "",
                    unconfirmedMessage:'Teams that could not be confirmed to exist. Please verify this team exits on HLTV and send'
                    + ' these teams back with request header "headervalidation": true',
                    teamsUnconfirmed: unconfirmedTeams ?? ""
                })
            }
            )

    })    
})

}
else{ //only requests with newly validated teams should end up here. 
      //If addToConfirmedTeams is called on a request containing known confirmed teams, will throw a duplicate record error.
    

    crud.addTeams(userName, teamList)
    .then(_ => {
        res.status(201).json({
            message:"Teams newly confirmed and added for " + userName + ": ",
            teamsConfirmedAndAdded: teamList
        })
    })
    .then(_ =>{
        crud.addToConfirmedTeams(teamList) //insert newly confirmed hltv team into
    })
}})


//response to the "-[team]" command
//requires: one JSON object with a teamsToRemove key with value(s) in a string array
app.post('/user/:user/removeteams',(req, res, next) => {
    var userName = req?.params?.user;
    var teamsToRemove = req?.body?.teamsToRemove;


if(teamsToRemove === null){
    res.status(400).json({
        message:"null provided as value to teamsToRemove key - invalid, request rejected with no deletions for user: " + userName ?? "nulluser"
    })
    return;
}

crud.removeTeams(userName, teamsToRemove)
.then( (result) => {
    if(typeof teamsToRemove === 'undefined'){
        res.status(200).json({
            message: "User: " + userName + " has been unsubscribed from ALL of their teams",
        })
        return;
    }
    let teamList = teamsToRemove.map(jsonifyTeamsDetailed)
    res.status(200).json({
        message: "User: " + userName + " has been unsubscribed from these teams",
        teamsRemoved: teamList
})

})

})



//for use with .map on the array of json objects returned by mysql select. should probably make this an arrow function.
function jsonifyTeams(item){
    var teamName = item.Team
    return teamName
}

function jsonifyTeamsDetailed(item){

    team = {
            Team: item.Team ?? item, //do this check to keep compatibility with the old 'teams passed as array of strings' method
            HltvId: item.HltvTeamId ?? 0
           }

    return team
}


module.exports = app;
