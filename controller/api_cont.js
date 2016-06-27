var Application = require('../dbhelper/application_model');
var Post = require('../dbhelper/post_model');
var User = require('../dbhelper/user_model');

function randomChars(num){
    var chars = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < num; i++ )
        chars += possible.charAt(Math.floor(Math.random() * possible.length));

    return chars;
}

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
		req.app.locals.signUp(req.params.email, req.params.name, function (token) {
			if(token==null)
				res.sendStatus(400);
			else
				res.send(token);
	    });
	},

	getProfileByToken: function(req, res){
		req.app.locals.getProfile(req.params.userToken, function (user) {
			if(user==null)
				res.sendStatus(400);
			else
				res.send(user);
	    });
	},

	getProfileByEmail: function(req, res){
		req.app.locals.getProfileByEmail(req.params.email, function (user) {
			if(user==null)
				res.sendStatus(400);
			else
				res.send(user);
	    });
	},

	getReccPost: function(req, res){
		req.app.locals.getReccPost(req.body.connections, req.body.sorting_type,
			req.body.isCreatorPopulated, function(rec_topic){
				res.send(rec_topic);
		})
	},

	getTimeLine: function(req, res){
		req.app.locals.getPostIdForHome(req.body.connections, 0, 0, true,
			function(arrayPostId, numOfPost){
			if(numOfPost != 0){
				Post.model
				.find({'_id': {$in : arrayPostId}})
				.sort({date_created: 'desc'})
				.limit(req.body.numOfPost)
				.exec(function(err,timeline_posts){
					if (err)
						console.log(err)
					res.send(timeline_posts);
				});
			}else{
				res.send("no_timeline_post");
			}
		});
	},

	getRandomPost: function(req, res){
		Post.model.count().exec(function(err, count){
		  var random = Math.floor(Math.random() * count);
		  Post.model.findOne().skip(random).exec(
		    function (err, result) {
		    	if(result.length != 0)
					res.send(result);
				else
					res.send("no_result")
		  });
		});
	},

	addFriend: function(req, res){
		req.app.locals.addContact(req.params.idUser, req.params.idPeople, 
			function(feedback){
				res.send(feedback);
		});
	},

	getListPeople: function(req, res ){
		User.model.count().exec(function(err, count){
		  var random = Math.floor(Math.random() * count);
		  User.model.find({_id: {$nin : req.body.idForSearch} })
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
		req.app.locals.givePost(idUser, content, title, keywords);
		res.send("createPost success");
	},

	sharePost: function(req, res){
		idUser = req.body.idUser;
		idPost = req.body.idPost;
		idOriginalCreator = req.body.idOriginalCreator;
		content = req.body.content;
		req.app.locals.giveShare(idUser, idPost, idOriginalCreator, content);
		res.send("sharePost success");
	},

	commentPost: function(req, res){
		idUser = req.body.idUser;
		idPost = req.body.idPost;
		content = req.body.content;
		req.app.locals.giveComment(idUser, idPost, content);
		res.send("commentPost success");
	},

	likePost: function(req, res){
		idUser = req.body.idUser;
		idPost = req.body.idPost;
		req.app.locals.giveLike(idUser, idPost);
		res.send("likePost success");
	}
}