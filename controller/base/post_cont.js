var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');

var post_func = require('../../controller/common/post_func');
var general_func = require('../../controller/common/general_func');

module.exports = { 
	getPost: function(req, res){
		Post.object
			.findById(req.body.id)
			.populate({
				  	path: 'creator',
		  			select: 'name email img_profile_name'
				})
			.populate({
				  path: 'original_creator',
				  select: 'name email img_profile_name'
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
		Post.object
			.findById(req.body.id, function(err, post){
			Post.object
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
		Post.object.
			findById(req.body.id, function(err, post){
				Post.object
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
		Post.object
			.findById(req.body.id, function(err, post){
			Post.object
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
		Post.object.findById(req.body.id,
				function(err, post){
			if(err){
				console.log(err);
				res.send("404");
			}else{
				index = post.like.indexOf(req.session.profile._id);
				if(index != -1){
					post_func.removeLike(req.session.profile._id, req.body.id);

					User.object.findById(req.session.profile._id)
					.exec(function(err, user){
						req.session.profile = user;
						res.send("dislike");
					});			
				}else{
					post_func.giveLike(req.session.profile._id, req.body.id);
					
					User.object.findById(req.session.profile._id)
					.exec(function(err, user){
						req.session.profile = user;
						res.send("like");
					});		
				}
			}
		});
	},

	addComment: function(req, res){
        console.log("req.body.creator : "+req.body.creator);
		post_func.giveComment(req.body.creator, req.body.id, req.body.content);

		User.object.findById(req.body.creator)
		.exec(function(err, user){
			req.session.profile = user;
			res.send("success!");
		});	
	},

	deleteComment: function(req, res){
		idUser = req.session.profile._id; 
		idPost = req.body.post_id; 
		idComment = req.body.id;

		Post.object.findById(idPost,
		    function(err, post){
		      index = -1;
		        for(var i = 0; i < post.comments.length && index== -1; i++) {
		         if(post.comments[i]._id == idComment) {
		           index =  i;
		         }
		      }
		      post.comments.splice(index, 1);
		      post.post_index = post_func.calculatePostIndex( post.share.length,  
		        post.like.length, post.comments.length );
		      post.id_unique_users = general_func.removeUniqueObj(idUser, post.id_unique_users);
		      post.save();

		      User.object.findById(idUser)
		        .exec(function(err, user){          
		          user.id_commented_posts = general_func.removeUniqueObj(idPost,user.id_commented_posts)
		          user.activeness = post_func.calculateUserActiveness(user.id_user_posts.length, user.id_share_posts.length, 
		            user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
		          user.id_unique_posts = general_func.removeUniqueObj(idPost, user.id_unique_posts);
		          user.save();              
		    }); 
		});

		User.object.findById(req.session.profile._id)
		.exec(function(err, user){
			req.session.profile = user;
			res.send("success");
		});	
	},

	addShare: function(req, res){
		post_func.giveShareWithCallback(req.session.profile._id, req.body.id_post, req.body.original_creator, req.body.content, function(){
			User.object.findById(req.session.profile._id)
			.exec(function(err, user){
				req.session.profile = user;
		  		res.redirect('back');
			});	
		});
	},

	addPost: function(req, res){
		post_func.givePostWithCallback(req.session.profile._id, req.body.content, req.body.title, req.body.keywords, function(){
			User.object.findById(req.session.profile._id, function(err, user){
				req.session.profile = user;	 
			  	res.redirect('back');
		  	});
		});
	},

	deletePost: function(req, res){
		idUser = req.session.profile._id;
		idPost = req.body.id;
		shared_post = false;

		Post.object.findById(idPost,
		    function(err, post){
		      
		      id_user_give_like = post.like;
		      id_user_give_share = post.share;
		      id_user_give_comment = new Array();

		      if(post.title == null){//delete share handle shared_post
		      	shared_post = true;
		        Post.object.findById(post.post_shared,
		            function(err, sharedPost){
		              if(sharedPost!=null){
		                // post not yet deleted 
		                index = sharedPost.share.indexOf(idUser);
		                sharedPost.share.splice(index,1);
		                sharedPost.id_unique_users = general_func.removeUniqueObj(""+idUser, sharedPost.id_unique_users);
		                sharedPost.post_index = post_func.calculatePostIndex( sharedPost.share.length,  
		                  sharedPost.like.length, sharedPost.comments.length );
		                
		                sharedPost.save();
		              }
		        });
		      }

		      for (var i = post.comments.length - 1; i >= 0; i--) {
		        if(!post_func.isObjectExist(id_user_give_comment,""+post.comments[i].creator))
		          id_user_give_comment.push(""+post.comments[i].creator);
		      };

		      idUser = new Object(idUser);

		      id_affected_user = new Object();
		      id_affected_user = JSON.parse(JSON.stringify( id_user_give_like.concat(
		        idUser,
		        id_user_give_comment,
		        id_user_give_share
		        )));

		      for (var i = id_affected_user.length - 1; i >= 0; i--) {
		        if(post_func.isObjectExist(id_affected_user.slice(0,i),id_affected_user[i]))
		          id_affected_user.splice(i,1);
		      };

		      console.log("## id_affected_user "+id_affected_user);
		      User.object.find({_id: {$in: id_affected_user}},
		        function(err, users){
		          for (var i = users.length - 1; i >= 0; i--) {

		            // remove unique object
		            index = -1;
		            for (var j = users[i].id_unique_posts.length - 1; index == -1 && j >= 0; j--) {
		              if(idPost == users[i].id_unique_posts[j].id){
		                index = j;
		              }
		            };
		            if(index != -1) // if -1 then it is a post that is h=shared and nothing to do with the saved unique posts id
		              users[i].id_unique_posts[index].remove();

		            if(id_user_give_like.indexOf(users[i]._id) != -1){
		              index = users[i].id_liked_posts.indexOf(idPost);
		              users[i].id_liked_posts.splice(index,1);
		            }

		            if(post_func.isObjectExist(id_user_give_comment,""+users[i]._id)){
		              index = -1;
		              for (var j = users[i].id_commented_posts.length - 1;index==-1 && j >= 0; j--) {
		                if(idPost == users[i].id_commented_posts[j].id)
		                  index = j;
		              }
		              users[i].id_commented_posts[index].remove();
		            }

		            if(id_user_give_share.indexOf(users[i]._id) != -1){
		              index = users[i].id_share_posts.indexOf(idPost);
		              users[i].id_share_posts.splice(index,1);
		            }

		            if(JSON.stringify(users[i]._id)==JSON.stringify(idUser)){
		                if(post.title == null){
		                  //delete share, handle this user
		                  index = users[i].id_share_posts.indexOf(idPost);
		                  users[i].id_share_posts.splice(index,1);
		                }else{
		                  index = users[i].id_user_posts.indexOf(idPost);
		                  users[i].id_user_posts.splice(index,1);
		                }
		            }

		            users[i].activeness = post_func.calculateUserActiveness(users[i].id_user_posts.length, users[i].id_share_posts.length, 
		              users[i].id_liked_posts.length, users[i].id_commented_posts.length, users[i].connections.length);
		            
		            users[i].save();
		          };
		          post.remove();
		        });
		});
		

		User.object.findById(req.session.profile._id, function(err, user){
			req.session.profile = user;	
			if(shared_post)
				res.send("shared_post");
			else
				res.send(req.body.id);
	  	});
	},

	updatePost: function(req, res){
		if(req.params.creator == req.session.profile._id && 
			general_func.isExistAtUniqueObj(req.params.id, req.session.profile.id_unique_posts)){
			var title = req.body.title;
			var keywords = req.body.keywords;
			var content = req.body.content;
			Post.object.findOneAndUpdate({_id: req.params.id},
				{title: title , keywords:keywords , content: content}, 
				{upsert:true}, function(err, post){
				if(err) console.log(err);
		  		res.redirect('back');
		  	});
		}else{
		 	res.send('/');
		}
	},
	updateSharePost: function(req, res){
		if(req.params.creator == req.session.profile._id && 
			general_func.isExistAtUniqueObj(req.params.id, req.session.profile.id_unique_posts)){
			var content = req.body.content;
			Post.object.findOneAndUpdate({_id: req.params.id},
				{content: content}, 
				{upsert:true}, function(err, post){
				if(err) console.log(err);
		  		res.redirect('back');
		  	});
		}else{
		 	res.send('/');
		}
	}
}



