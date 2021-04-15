const dbConn = require('./DataCreds.js');



const getTeams = (userName) => {

return new Promise((resolve, reject) =>{
    let queryText ="SELECT * FROM UserTeams WHERE UserName = ?";
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

            queryText += "('" + userName + "','" + teamsToInsert[i].teamName + "'),"
        
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

const doesTeamExist = (teams) =>{    
  return new Promise((resolve, reject) => {
    dbConn.query("SELECT * FROM existingteams WHERE TeamName IN (?)", [teams], (err, result, fields) => {
        if(err) {
            console.log("Error in db doesTeamExist function: ", err)
            return reject(err)
        }
            var existsResult = result
            resolve(existsResult)
        })
  }  
  )
}

exports.getTeams = getTeams;
exports.addTeams = addTeams;
exports.doesTeamExist = doesTeamExist;