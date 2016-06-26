var Application = require('../dbhelper/application_model');
var Post = require('../dbhelper/post_model');
var User = require('../dbhelper/user_model');

module.exports = { 
	isApplicationRegistered: function(username, password, callback){
		Application.model
		.find({username: username, password: password}, 
			function(err, result){
				if (!err){
					// var Application = require('../dbhelper/application_model');
					// var app = new Application.model({username: "daniarheri", password: "daniarheri"});
					// app.save();
					// console.log(result)
					if(result.length != 0){
						callback("find it!"); return;
					}else{
						callback("not find!"); return;
					}
				}else{
					callback(err); return;
				}
		});
	}

}