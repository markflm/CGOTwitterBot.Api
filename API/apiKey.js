const checkReqCredentials = incomingKey => {
	var validKey = incomingKey == (process.env.apiKey || '0');

	return validKey;
};

module.exports = checkReqCredentials;
