var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');

var page_home_func = require('../../controller/common/paging/page_home_func');
var general_func = require('../../controller/common/general_func');

function calculateUserActivenessFunc(numOfPost, numOfShare, numOfLike, numOfComment, numOfConnections){
  	return ((numOfPost* 20)+(numOfShare* 8)+(numOfLike* 3)+(numOfComment* 5)+numOfConnections);
}

function calculatePostIndexFunc(numOfShare, numOfLike, numOfComment){
  	return ((numOfShare* 3)+(numOfLike* 1)+(numOfComment* 2));
}

module.exports = { 
	removeLike: function(idUser, idPost){
		Post.object.findById(idPost,
		    function(err, post){
		    index = post.like.indexOf(idUser);
		    post.like.splice(index,1);
		    post.post_index = calculatePostIndexFunc( post.share.length,  
		      post.like.length, post.comments.length );
		    post.id_unique_users = general_func.removeUniqueObj(idUser, post.id_unique_users);
		    post.save();

		    User.object.findById(idUser)
		      .exec(function(err, user){
		        indexPost = user.id_liked_posts.indexOf(idPost);
		        user.id_liked_posts.splice(indexPost,1);
		        user.id_unique_posts = general_func.removeUniqueObj(idPost, user.id_unique_posts);
		        user.activeness = calculateUserActivenessFunc(user.id_user_posts.length, user.id_share_posts.length, 
		            user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
		        user.save();
		        return "dislike";
		    }); 
		});
	},

	calculateUserActiveness: function(numOfPost, numOfShare, numOfLike, numOfComment, numOfConnections){
	  return calculateUserActivenessFunc(numOfPost, numOfShare, numOfLike, numOfComment, numOfConnections);
	},

	calculatePostIndex: function(numOfShare, numOfLike, numOfComment){
	  return calculatePostIndexFunc(numOfShare, numOfLike, numOfComment);
	},

	giveLike: function(idUser, idPost){
		Post.object.findById(idPost,
		    function(err, post){
		    post.like.push(idUser);
		    post.post_index = calculatePostIndexFunc( post.share.length,  
		      post.like.length, post.comments.length );
		    post.id_unique_users = general_func.addUniqueObj(idUser, post.id_unique_users);
		    post.save();

		    User.object.findById(idUser)
		      .exec(function(err, user){
		        user.id_liked_posts.push(idPost);
		        user.id_unique_posts = general_func.addUniqueObj(idPost, user.id_unique_posts);
		        user.activeness = calculateUserActivenessFunc(user.id_user_posts.length, user.id_share_posts.length, 
		            user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
		        user.save();    	        
		    }); 
		});
	},

	giveComment: function(idUser, idPost, content){
		Post.object.findById(idPost,
		    function(err, post){
		      objComment = new Object();
		        objComment.content = content;
		        objComment.creator = idUser;
		      post.comments.push(objComment);
		      post.post_index = calculatePostIndexFunc( post.share.length,  
		        post.like.length, post.comments.length );
		      post.id_unique_users = general_func.addUniqueObj(idUser, post.id_unique_users);
		      post.save();

	          // console.log("idUser : "+idUser);
		      User.object.findById(idUser)
		        .exec(function(err, user){
		          	user.id_commented_posts = general_func.addUniqueObj(idPost,user.id_commented_posts)
		          	user.id_unique_posts = general_func.addUniqueObj(idPost, user.id_unique_posts);
		          	user.activeness = calculateUserActivenessFunc(user.id_user_posts.length, user.id_share_posts.length, 
		            user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
		          	user.save();             
		      }); 
		});
	},

 	giveShare: function(idUser, idPost, idOriginalCreator, content){
		Post.object.findById(idPost,
		    function(err, post){
		    post.share.push(idUser);
		    post.post_index = calculatePostIndexFunc( post.share.length,  
		      post.like.length, post.comments.length );
		    post.id_unique_users = general_func.addUniqueObj(idUser, post.id_unique_users);
		    post.save();

		    var postObj = new Post.model({creator: idUser, 
		      content: content, post_shared: idPost, original_creator:idOriginalCreator});
		    postObj.save();
		    User.object.findById(idUser)
		    .exec(function(err, user){
		     	 user.id_share_posts.push(postObj._id);
		      	user.id_unique_posts = general_func.addUniqueObj(postObj._id, user.id_unique_posts);
		      	user.activeness = calculateUserActivenessFunc(user.id_user_posts.length, user.id_share_posts.length, 
		        user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
		      	user.save();
		    }); 
		});
	},
	
	givePost: function(idUser, content, title, keywords){
		var postObj = new Post.model({creator: idUser, content: content, title: title, keywords: keywords});
	  	postObj.save();
	  	User.object.findById(idUser, function(err, user){
		    user.id_user_posts.push(postObj._id);
		    user.activeness = calculateUserActivenessFunc(user.id_user_posts.length, user.id_share_posts.length, 
		      user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
		    user.id_unique_posts = general_func.addUniqueObj(postObj._id, user.id_unique_posts);
		    user.save();
	    });
	},

	giveShareWithCallback: function(idUser, idPost, idOriginalCreator, content, callback){
		Post.object.findById(idPost,
		    function(err, post){
		    post.share.push(idUser);
		    post.post_index = calculatePostIndexFunc( post.share.length,  
		      post.like.length, post.comments.length );
		    post.id_unique_users = general_func.addUniqueObj(idUser, post.id_unique_users);
		    post.save();

		    var postObj = new Post.model({creator: idUser, 
		      content: content, post_shared: idPost, original_creator:idOriginalCreator});
		    postObj.save();
		    User.object.findById(idUser)
		    .exec(function(err, user){
		     	 user.id_share_posts.push(postObj._id);
		      	user.id_unique_posts = general_func.addUniqueObj(postObj._id, user.id_unique_posts);
		      	user.activeness = calculateUserActivenessFunc(user.id_user_posts.length, user.id_share_posts.length, 
		        user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
		      	user.save(function (err, p) {
			          callback("success");
			    		return;
		          });
		    }); 
		});
	},
	
	givePostWithCallback: function(idUser, content, title, keywords, callback){
		var postObj = new Post.model({creator: idUser, content: content, title: title, keywords: keywords});
	  	postObj.save();
	  	User.object.findById(idUser, function(err, user){
		    user.id_user_posts.push(postObj._id);
		    user.activeness = calculateUserActivenessFunc(user.id_user_posts.length, user.id_share_posts.length, 
		      user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
		    user.id_unique_posts = general_func.addUniqueObj(postObj._id, user.id_unique_posts);
		    user.save(function (err, p) {
			          callback("success");
			    		return;
		          });
	    });
	},

	getReccPost: function(profile_id, connections, sorting_type, isCreatorPopulated, callback){
		page_home_func.getPostIdForHome(connections, 0, 0, false, 
		    function(arrayPostId, numOfPost){
		    //asc = increasing
		    //desc = decreasing
		    if (isCreatorPopulated){
		      // for UI
		      Post.object
		      .find({'_id': {$in : arrayPostId}})
		      .sort({post_index: sorting_type})
		      .limit(5)
		      .populate('creator')
		      .exec(function(err,rec_topic){
		        if(err)
		          console.log(err)

		        if(rec_topic.length == 0){
		          console.log("No recommended post!")
		          callback("no_recc_topic");  
		        }else{
		        	id = profile_id;
					for (var i = rec_topic.length - 1;  i >= 0; i--) {
						if(rec_topic[i].creator._id == id){
							 rec_topic[i].creator = null;
						}
						if(rec_topic[i].like.indexOf(id) != -1){
							 rec_topic[i].liked = true;
						}
						if(rec_topic[i].share.indexOf(id) != -1){
							rec_topic[i].shared = true;
						} 
						if((rec_topic[i].creator == null) && (rec_topic[i].post_shared != null)  && 
							(rec_topic[i].post_shared.share.indexOf(id) != -1)){
							rec_topic[i].post_shared.shared = true;
						}
					}

		         	callback(rec_topic); 
		        }
		        return;
		      });
		    }else{
		      Post.object
		      .find({'_id': {$in : arrayPostId}})
		      .sort({post_index: sorting_type})
		      .limit(5)
		      .exec(function(err,rec_topic){
		        if(err)
		          console.log(err)
		        if(typeof(rec_topic) == "undefined" || rec_topic.length == 0){
		          console.log("no_recc_topic app.js!")
		          callback("no_recc_topic");  
		        }else{

		        	id = profile_id;
					for (var i = rec_topic.length - 1;  i >= 0; i--) {
						if(rec_topic[i].creator._id == id){
							 rec_topic[i].creator = null;
						}
						if(rec_topic[i].like.indexOf(id) != -1){
							 rec_topic[i].liked = true;
						}
						if(rec_topic[i].share.indexOf(id) != -1){
							rec_topic[i].shared = true;
						} 
						if((rec_topic[i].creator == null) && (rec_topic[i].post_shared != null)  && 
							(rec_topic[i].post_shared.share.indexOf(id) != -1)){
							rec_topic[i].post_shared.shared = true;
						}
					}
		          	callback(rec_topic); 

		        }
		        return;
		      });
		    }
		});
	},

	isObjectExist: function(arrayObject, object){
	  for (var i = arrayObject.length - 1; i >= 0; i--) {
	    if(arrayObject[i] === object){
	      return true;
	    }
	  };
	  return false;
	},

	test: function(){
		return "test";
	}
}