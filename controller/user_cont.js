var fs = require('fs');
var im = require('imagemagick');

var User = require('../dbhelper/user_model');
var hash = require("../public/javascripts/sha256.js");

module.exports = { 
	isAccountExist: function(req, callback){
		var email = req.body.email;
		var password = req.body.password;
		password = hash.sha256_digest(password);
		User.object
			.findOne({email: email, password: password},function(err, data){
			if( data == null ) {
				callback({
					status : "not exist",
					message : "Username or password is incorrect!"
				}); return;
	        } else {
        		req.session.profile = data;
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
		var token = req.app.locals.createToken();
	  	if (confirmed_password === password){
	  		User.object
	  			.findOne({email: email}, function(err, data){

	  			if( data != null ) {
					callback({
						status : "failed",
						message : 'Email '+email+' is already registered!'
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
		        	req.session.profile = userObj;
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
		User.model
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

				User.model
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
		User.model.findById(req.session.profile._id, function(err, user){
			user.token = req.app.locals.createToken();
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
	}
}

