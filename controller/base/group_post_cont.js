var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');
var Group = require('../../dbhelper/group_model');

var post_func = require('../../controller/common/post_func');
var group_post_func = require('../../controller/common/group_post_func');
var general_func = require('../../controller/common/general_func');

module.exports = {
	addPost: function(req, res){
		if (!group_post_func.isThisMyGroup(req.body.group_id, req.session.profile.groups)){
			response.setFailedResponse(res, "Sorry, that is not your group!");
		}else{
			group_post_func.givePostWithCallback(req.body.group_id, req.session.profile._id, req.body.content, req.body.title, req.body.keywords, function(){
				User.object.findById(req.session.profile._id, function(err, user){
					req.session.profile = user;	 
				  	res.redirect('back');
			  	});
			});
		}
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
					group_post_func.removeLike(req.session.profile._id, req.body.id);

					User.object.findById(req.session.profile._id)
					.exec(function(err, user){
						req.session.profile = user;
						res.send("dislike");
					});			
				}else{
					group_post_func.giveLike(req.session.profile._id, req.body.id);
					
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
		group_post_func.giveComment(req.body.creator, req.body.id, req.body.content);

		User.object.findById(req.body.creator)
		.exec(function(err, user){
			req.session.profile = user;
			res.send("success!");
		});	
	},

	deletePost: function(req, res){
		idUser = req.session.profile._id;
		idPost = req.body.id;
		shared_post = false;

		Post.object.findById(idPost,
		    function(err, post){
		    	if(err || post==null){
		    		console.log(err)
					res.send("404");
		    	}else{
			      	Group.object.findById(post.type.group_id)
			      	.exec(function (err, group){
			      		if (err)
			      			console.log(err)

					    index = group.group_posts.indexOf(post._id);
					    group.group_posts.splice(index,1);
			        	group.save();

			        	post.remove();

						User.object.findById(req.session.profile._id, function(err, user){
							req.session.profile = user;	
								res.send(req.body.id);
					  	});
			      	})
			     }
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
		      post.save();

		});

		User.object.findById(req.session.profile._id)
		.exec(function(err, user){
			req.session.profile = user;
			res.send("success");
		});	
	},
}



