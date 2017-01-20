
var host = require('./private_data/agent_files/hostServer');

module.exports = { 
	'facebookAuth': {
	  'clientID': '161306487604464',
	  'clientSecret': 'a913446826538b99c3f03485552304e7',
	  'callbackURL': host.name+"/auth/facebook/callback",
	  'profileFields': ['id', 'displayName', 'photos', 'email']
	}
}