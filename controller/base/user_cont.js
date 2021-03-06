var fs = require('fs');
var im = require('imagemagick');

var general_func = require('../../controller/common/general_func');

var User = require('../../dbhelper/user_model');
var hash = require("../../public/javascripts/others/sha256.js");


function initiateSession(req){
  	// Setting
  	req.session.setting = {
  		show_online_chat: false,
  		show_popular_post: true,
  		show_recc_post: true
  		};
}


module.exports = { 
	isAccountExist: function(req, callback){
		var email = req.body.email;
		var password = req.body.password;
		password = hash.sha256_digest(password);
		User.object
			.findOne({email: email, password: password})
			.select('-password')
			.exec( function(err, data){
			if( data == null ) {
				callback({
					status : "not exist",
					message : "Username or password is incorrect!"
				}); return;
	        } else {
        		req.session.profile = data;
        		initiateSession(req);
				callback({
					status : "exist",
					message : "null"
				}); return;
		    }
		});
	},

	registerNewUser: function(req, callback){
		var email = req.body.email;
		var name = req.body.name;
		var password = req.body.password;
		var confirmed_password = req.body.confirmed_password;
		var token = general_func.createToken();
	  	if (confirmed_password === password){
	  		User.object
	  			.findOne({email: email}, function(err, data){

	  			if( data != null ) {
					callback({
						status : "failed",
						message : 'SignUp failed! Email '+email+' is already registered!'
					}); return;
		        } else {
		        	var path =  "./public/images/"+email+"/"
		        	if (!fs.existsSync(path)){
		        		fs.mkdirSync(path);
		        	}
		        	var pathProfile = path+ "profile/"
		        	if (!fs.existsSync(pathProfile)){
		        		fs.mkdirSync(pathProfile);
		        	}
		        	pathProfile += "profile.jpg"
		        	fs.readFile("./public/images/profile.jpg", function(err, foto){
		        		fs.writeFile(pathProfile, foto, function(error){
		        		});  
		        	});

		        	var pathCover = path+"cover/"
		        	if (!fs.existsSync(pathCover)){
		        		fs.mkdirSync(pathCover);
		        	}
		        	pathCover += "cover.jpg"
		        	fs.readFile("./public/images/cover.jpg", function(err, foto){
		        		fs.writeFile(pathCover, foto, function(error){
		        		});  
		        	});
					password = hash.sha256_digest(password);
		        	var userObj = new User.model({token: token, name: name, email: email, password: password});
		        	userObj.save();

					req.session.profile = JSON.parse(JSON.stringify(userObj));;
		        	req.session.profile.password = undefined;
        			initiateSession(req);
					callback({
						status : "success",
						message : null
					}); return;
				}
			});
	  	}else{
			callback({
				status : "failed",
				message : 'Confirmed password is incorrect!'
			}); return;
	  	}
	},

	getUser: function(req, res){
		User.object
			.findById(req.body.id, function(err, user){
			if(err){
				console.log(err);
				res.send("404");
			}else{
				res.send(user);
			}
		});
	},

	uploadProfilePicture: function(req, res){
		var img = req.files.img_profile;
		fs.readFile(img.path, function(err, data){
			if(err){
				return res.redirect("/tmpError/"+err);
			}

			var path =  "./public/images/"+req.session.profile.email+"/"
			if (!fs.existsSync(path)){
				fs.mkdirSync(path);
				
			}
			path += "profile/";
			if (!fs.existsSync(path)){
				fs.mkdirSync(path);
			}

			path += img.originalFilename;

			fs.writeFile(path, data, function(error){
				if (error) console.log(error);

				User.object
					.findOneAndUpdate({_id: req.session.profile._id}, 
						{img_profile_name:img.originalFilename}, 
						{upsert:true}, function(err, data){
					if (err){
						return res.send(500, { error: err });
					}else{

						im.crop({
						  srcPath: img.path,
						  dstPath: 'public/images/'+req.session.profile.email+"/profile/"+img.originalFilename,
						  width:   256,
					  	  height: 256,
						}, function(err, stdout, stderr){
						  if (err) {
						  	console.log("/errCrop/"+err);
						  };
							req.session.profile.img_profile_name = img.originalFilename;
							return res.redirect("/profile/"+req.session.profile.email);
						});
					}
				});
			}
			);  
		});
	},

	generateToken: function(req, res){
		User.object.findById(req.session.profile._id)
			.select('-password')
			.exec(function(err, user){
			user.token = general_func.createToken();
			user.save();
			req.session.profile = user;
			res.send("Token has been generated!")
	  	});
	},

	getToken: function(req, res){
		res.send(req.session.profile.token);
	},

	logout: function(req, res){
		req.session.destroy();
		res.redirect('/login');
	},

	getDataUserProfilePicture: function(req, res){
		var idUsers = req.body.idUsers.split(',');
		User.object.find({_id: {$in: idUsers}})
			.select(' name email img_profile_name')
			.limit(20)
			.exec(function(err, users){
				if (err) {
					response.setFailedResponse(res, err);
				} else {
					response.setSucceededResponse(res, users);
				}
			})
	},

	updateProfile: function(req, res){
		User.object.findById(req.session.profile._id)
			.exec(function(err, user_data){
				if (err || user_data == null) {
					response.setFailedResponse(res, err);
				}else{
					user_data.name = req.body.name; 
					user_data.secondary_email = req.body.email; 
					
					user_data.education = req.body.education; 
					user_data.about = req.body.about; 
					user_data.occupation = req.body.occupation; 

					req.session.profile = JSON.parse(JSON.stringify(user_data));;
					if(req.body.password.length >= 8){
						user_data.password = hash.sha256_digest(req.body.password);
					} 

					user_data.save();

					req.session.profile.password = undefined;
					response.setSucceededResponse(res, "success edit profile!");
				}

			})
	}


}

