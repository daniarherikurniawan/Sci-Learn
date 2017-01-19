var Application = require('../../dbhelper/application_model');
var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');

var fs = require('fs');
var lwip = require('lwip');

var general_func = require('../../controller/common/general_func');
var post_func = require('../../controller/common/post_func');
var connection_func = require('../../controller/common/connection_func');
var page_home_func = require('../../controller/common/paging/page_home_func');


module.exports = { 
	isApplicationRegistered: function(username, password, callback){
		Application.object
		.find({username: username, password: password}, 
			function(err, result){
				if (!err){
					// var Application = require('../dbhelper/application_model');
					// var app = new Application.model({username: "daniarheri", password: "daniarheri"});
					// app.save();
					// console.log(result)
					if(result.length != 0){
						callback(true); return;
					}else{
						callback(false); return;
					}
				}else{
					callback(err); return;
				}
		});
	},

	signUp: function(req, res){
		email = req.params.email;
		name = req.params.name;
	  	User.object.findOne({email: email}, function(err, data){
	    // console.log("email  "+email);
	    if( data != null ) {
				res.sendStatus(400);
	          	return ;
	        } else { 
	          password = general_func.randomChars(8);
	          var path =  "./public/images/"+email+"/"
	          if (!fs.existsSync(path)){
	            fs.mkdirSync(path);
	          }
	          var pathProfile = path+ "profile/"
	          if (!fs.existsSync(pathProfile)){
	            fs.mkdirSync(pathProfile);
	          }
	          pathProfile += "profile.jpg"

	          // Apply border to an Image
	          lwip.open('./public/images/profile.jpg', function(err, image) {
	            if (err) throw err;
	              var _brdOpts = {
	              width: 20,
	              color: general_func.randomImageBorderColor()
	            }
	            image.border(_brdOpts.width, _brdOpts.color, function(err, brdImg) {
	              if (err) throw err;
	              brdImg.writeFile('./public/images/profile_border.jpg', function(err) {
	                if (err) {
	                  fs.readFile("./public/images/profile.jpg", function(err, foto){
	                    fs.writeFile(pathProfile, foto, function(error){
	                    });  
	                  });
	                }else{

	                  fs.readFile("./public/images/profile_border.jpg", function(err, foto){
	                    fs.writeFile(pathProfile, foto, function(error){
	                    });  
	                  });
	                }

	                var pathCover = path+"cover/"
	                if (!fs.existsSync(pathCover)){
	                  fs.mkdirSync(pathCover);
	                }
	                pathCover += "cover.jpg"
	                fs.readFile("./public/images/cover.jpg", function(err, foto){
	                  fs.writeFile(pathCover, foto, function(error){
	                  });  
	                });
	                var token = general_func.createToken();
	                var userObj =  new User.model({token: token, name: name, email: email, password: password});
	                  userObj.save();
	                  res.send(token);
	                  return ;

	                });
	            });
	          });
	        }
	  	});

	},

	getProfileByToken: function(req, res){
	    User.object.findOne({token: req.params.userToken}, function(err, user){
	      if(err){
				res.sendStatus(500);
	      }else{
	        if(user==null)
				res.sendStatus(400);
			else
				res.send(user);
	      }
	      return ;
	    });
	},

	getProfileByEmail: function(req, res){
	    User.object.findOne({email: req.params.email}, function(err, user){
	      	if(err){
				res.sendStatus(500);
	      	}else{
	      		if(user==null)
					res.sendStatus(400);
				else
					res.send(user);
	      	}
	      	return ;
	    });
	},

	getReccPost: function(req, res){
		connections = req.body.connections;
		sorting_type = req.body.sorting_type;
	  	isCreatorPopulated = req.body.isCreatorPopulated;
	  	if(req.session.profile != null){
 			post_func.getReccPost(req.session.profile._id, connections, sorting_type, isCreatorPopulated, function(result){
 				res.send(result);
 			})
 		}else{
 			post_func.getReccPost(req.body._id, connections, sorting_type, isCreatorPopulated, function(result){
 				res.send(result);
 			})
 		}
		
	},

	getTimeLine: function(req, res){
		page_home_func.getPostIdForHome(req.body.connections, 0, 0, true,
			function(arrayPostId, numOfPost){
			if(numOfPost != 0){
				Post.object
				.find({'_id': {$in : arrayPostId}})
				.sort({date_created: 'desc'})
				.limit(req.body.numOfPost)
				.exec(function(err,timeline_posts){
					if (err)
						console.log(err)
					else if(timeline_posts == null)
						res.send([])
					else
						res.send(timeline_posts);
				});
			}else{
				res.send("no_timeline_post");
			}
		});
	},

	getRandomPost: function(req, res){
		Post.object.count().exec(function(err, count){
		  var random = Math.floor(Math.random() * count);
		  Post.object.findOne().skip(random).exec(
		    function (err, result) {
		    	if(result!= null && result.length != 0)
					res.send(result);
				else
					res.send("no_result")
		  });
		});
	},

	addFriend: function(req, res){
		idUser = req.params.idUser;
		idPeople = req.params.idPeople;

		connection_func.addConnection(idUser, idPeople, function(result){
			res.send(result);
		});
	
	},

	getListPeople: function(req, res ){
		User.object.count().exec(function(err, count){
		  var random = Math.floor(Math.random() * count);
		  User.object.find({_id: {$nin : req.body.idForSearch} })
			.skip(random)
			.limit(req.body.limit)
			.exec(
		    function (err, result) {
				res.send(result);
		  });
		});
	},

	createPost: function(req, res){
		idUser = req.body.idUser;
		content = req.body.content;
		title = req.body.title;
		keywords = req.body.keywords;
	  	post_func.givePost(idUser, content, title, keywords);
		res.send("createPost success");
	},

	sharePost: function(req, res){
		idUser = req.body.idUser;
		idPost = req.body.idPost;
		idOriginalCreator = req.body.idOriginalCreator;
		content = req.body.content;
		post_func.giveShare(idUser, idPost, idOriginalCreator, content);
		res.send("sharePost success");

	},

	commentPost: function(req, res){
		idUser = req.body.idUser;
		idPost = req.body.idPost;
		content = req.body.content;
		post_func.giveComment(idUser, idPost, content);
		res.send("commentPost success"); 
	},

	likePost: function(req, res){
		idUser = req.body.idUser;
		idPost = req.body.idPost;
		post_func.giveLike(idUser, idPost);		
		res.send("likePost success");
	},


}