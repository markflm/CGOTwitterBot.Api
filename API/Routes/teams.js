const express = require('express');
const router = express.Router(); //creates router from express package imported above
const dbConn = require('./../../DataCreds.js');

router.get('/:team/getusers', (req, res) => {
	var teamName = req.params.team;
	dbConn.query(
		'SELECT DISTINCT UserName from userteams where Team = ?',
		teamName,
		(err, result, fields) => {
			if (err) throw err;
			console.log(result);
			userList = result.map(item => {
				var user = item.UserName;
				return user;
			});
			console.log(userList);
			res.status(200).json({
				message: 'Users subscribed to ' + teamName,
				users: userList,
			});
		}
	);
});

module.exports = router; //allow app.js to use redirect /team traffic here
