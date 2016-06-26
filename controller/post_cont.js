var Post = require('../dbhelper/post_model');
var User = require('../dbhelper/user_model');

module.exports = { 
	getPost: function(req, res){
		Post.model
			.findById(req.body.id)
			.populate({
				  path: 'creator',
				})
			.populate({
				  path: 'original_creator',
				})
			.populate('post_shared')
			.exec(function (err,dataPost){
			if(err){
				console.log(err);
				res.send("404");
			}else	{
				id = req.session.profile._id;
				if(dataPost.creator._id == id){
					 dataPost.creator = null;
				}
				if(dataPost.like.indexOf(id) != -1){
					 dataPost.liked = true;
				}
				if(dataPost.share.indexOf(id) != -1){
					dataPost.shared = true;
				}
				if((dataPost.creator == null) &&
				 (dataPost.post_shared != null)  && (dataPost.post_shared.share.indexOf(id) != -1)){
					dataPost.post_shared.shared = true;
				}
			
				res.send(dataPost);
			}
		});
	},

	getComment: function(req, res){
		Post.model
			.findById(req.body.id, function(err, post){
			Post.model
				.populate(post.comments, {path: 'creator' }, 
					function (err,comments){
				if(err){
					console.log(err);
					res.send("404");
				}else{
					res.send(comments);
				}
			});
		});
	},

	getLike: function(req, res){
		Post.model.
			findById(req.body.id, function(err, post){
				Post.model
					.populate(post, {path: 'like' }, 
					function (err,post){
					if(err){
						console.log(err);
						res.send("404");
					}else{
						res.send(post.like);
					}
				});
		});
	},

	getShare: function(req, res){
		Post.model
			.findById(req.body.id, function(err, post){
			Post.model
				.populate(post, {path: 'share' }, function (err,post){
				if(err){
					console.log(err);
					res.send("404");
				}else{
					res.send(post.share);
				}
			});
		});
	},

	addLike: function(req, res){
		Post.model.findById(req.body.id,
				function(err, post){
			if(err){
				console.log(err);
				res.send("404");
			}else{
				index = post.like.indexOf(req.session.profile._id);
				if(index != -1){
					req.app.locals.removeLike(req.session.profile._id, req.body.id);

					User.model.findById(req.session.profile._id)
					.exec(function(err, user){
						req.session.profile = user;
						res.send("dislike");
					});			
				}else{
					req.app.locals.giveLike(req.session.profile._id, req.body.id);
					
					User.model.findById(req.session.profile._id)
					.exec(function(err, user){
						req.session.profile = user;
						res.send("like");
					});		
				}
			}
		});
	},

	addComment: function(req, res){
		req.app.locals.giveComment(req.body.creator, req.body.id, req.body.content);

		User.model.findById(req.body.creator)
		.exec(function(err, user){
			req.session.profile = user;
			res.send("success!");
		});	
	},

	deleteComment: function(req, res){
		req.app.locals.removeComment(req.session.profile._id, req.body.post_id, req.body.id);

		User.model.findById(req.session.profile._id)
		.exec(function(err, user){
			req.session.profile = user;
			res.send("success");
		});	
	},

	addShare: function(req, res){
		req.app.locals.giveShare(req.session.profile._id, req.body.id_post, req.body.original_creator, req.body.content);

		User.model.findById(req.session.profile._id)
		.exec(function(err, user){
			req.session.profile = user;
			res.redirect('/');
		});	
	},

	addPost: function(req, res){
		req.app.locals.givePost(req.session.profile._id, req.body.content, req.body.title, req.body.keywords);
		
		User.model.findById(req.session.profile._id, function(err, user){
			req.session.profile = user;	  			
			res.redirect('/');
	  	});
	},

	deletePost: function(req, res){
		req.app.locals.removePost(req.session.profile._id, req.body.id);
		
		User.model.findById(req.session.profile._id, function(err, user){
			req.session.profile = user;	  			
			res.send(req.body.id);
	  	});
	},

	updatePost: function(req, res){
		if(req.params.creator == req.session.profile._id){
			var title = req.body.title;
			var keywords = req.body.keywords;
			var content = req.body.content;
			Post.model.findOneAndUpdate({_id: req.params.id},
				{title: title , keywords:keywords , content: content}, 
				{upsert:true}, function(err, post){
				if(err) console.log(err);
		  		res.redirect('/');
		  	});
		}else{
		 	res.send('/');
		}
	}
}



