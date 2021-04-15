const dbConn = require('./DataCreds.js');



const getTeams = (userName) => {

return new Promise((resolve, reject) =>{
    let queryText ="SELECT ut.Team, e.HltvTeamId FROM userteams ut LEFT JOIN existingteams e on ut.Team = e.Team WHERE UserName = ?";
    dbConn.query(queryText, userName, (err, result, fields) => {
        if(err) {
            console.log("Error in db getTeams function: ", err)
            return reject(err)
        }
       
       resolve(result)
    })
}) 

}

const addTeams = (userName, teamsToInsert) => {

return new Promise((resolve, reject) => {
    let queryText = "INSERT INTO userteams (UserName, Team) VALUES "
        //concat insert string together
        for(i = 0; i < teamsToInsert.length; i++){

            queryText += "('" + userName + "','" + teamsToInsert[i].Team + "'),"
        
        }
        queryText = queryText.substr(0, queryText.length - 1 )
    dbConn.query(queryText, (err, result, fields )=> {
        if(err) {
            console.log("Error in db addTeams function: ", err)
            return reject(err)
        }
        resolve(result)
    })



})
}

const removeTeams = (userName, teamsToRemove) => {

  return new Promise((resolve, reject) => {
    let queryText = 'DELETE FROM userteams WHERE '
    if (typeof teamsToRemove === 'undefined'){ //undefined is standard for 'delete all records'
        dbConn.query(queryText + 'Username = ?', userName, (err, result, fields) => {
            if (err) {
                console.log("Remove all teams db call threw error")
                return reject(err)
                }
            resolve(result)
    }
    )}
    else if (teamsToRemove.length <= 0) resolve();
    else{
        let deleteString = ""
        for(i = 0; i < teamsToRemove.length;i++){
            deleteString += "'" + teamsToRemove[i] + "',"
        }
        deleteString = deleteString.substr(0, deleteString.length - 1)
        dbConn.query(queryText + "team IN (" + deleteString + ") AND UserName = ?", userName, (err, result, fields) => {
            if (err) {
                console.log("Remove teams db call threw error")
                return reject(err)
                }
                resolve(result);
        })

    }}
  )  

}

const doesTeamExist = (teams) =>{    
  return new Promise((resolve, reject) => {
    let teamNames = teams.map(item => item.Team)
    dbConn.query("SELECT * FROM existingteams WHERE Team IN (?)", [teamNames], (err, result, fields) => {
        if(err) {
            console.log("Error in db doesTeamExist function: ", err)
            return reject(err)
        }
            resolve(result)
        })
  }  
  )
}

const addToConfirmedTeams = (teams) => {
    return new Promise((resolve, reject) => {
        let queryText = "INSERT INTO existingteams (Team, HltvTeamId) VALUES "
        for(i=0; i < teams.length; i++){
            queryText += "('" + teams[i].Team + "','" + (teams[i].HltvId ?? null) + "'),"
        }
        queryText = queryText.substr(0, queryText.length - 1 )
    dbConn.query(queryText, (err, result, fields) => {
        if(err) {
            console.log("Error in db addToConfirmedTeams function: ", err)
            return reject(err)
        }
            resolve(result)
    })

    })
}

exports.getTeams = getTeams;
exports.addTeams = addTeams;
exports.removeTeams = removeTeams;
exports.doesTeamExist = doesTeamExist;
exports.addToConfirmedTeams = addToConfirmedTeams;