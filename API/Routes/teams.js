const express = require('express');
const router = express.Router(); //creates router from express package imported above
const dbConn = require('./../../DataCreds.js');
const crud = require('./../../crud.js');

router.get('/:team/getusers', (req, res) => {
	var teamName = req?.params?.team;

	crud
		.getUsersForTeamMatch(teamName)
		.then((result) => {
			let userList = result;
			res.status(200).json({
				message: 'Users subscribed to ' + teamName,
				users: userList,
			});
		})
		.catch((err) => {
			let errorMsg = `Error in getUsersForTeamMatch database call: ${err}`;
			console.log(errorMsg);
			res.status(200).json({
				message: errorMsg,
			});
		});
});

module.exports = router; //allow app.js to use redirect /team traffic here
