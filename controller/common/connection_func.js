var User = require('../../dbhelper/user_model');

var post_func = require('../../controller/common/post_func');

module.exports = { 
	addConnection: function(idUser, idPeople, callback){
		User.object.findById(idPeople, function(err, userA){
		    if(err){
		      console.log(err);
		      callback ("404"); 
		    	return;
		    }else{
		      User.object.findById( idUser, function(err, userB){
		        index = userA.connections.indexOf(userB._id);
		        if(index == -1){

		          userA.connections.push(idUser);  
		          userA.activeness = post_func.calculateUserActiveness(userA.id_user_posts.length, userA.id_share_posts.length, 
		            userA.id_liked_posts.length, userA.id_commented_posts.length, userA.connections.length);
		          userA.save();

		          userB.connections.push(idPeople);
		          userB.activeness = post_func.calculateUserActiveness(userB.id_user_posts.length, userB.id_share_posts.length, 
		            userB.id_liked_posts.length, userB.id_commented_posts.length, userB.connections.length);
		          userB.save(function (err, p) {
			          callback("success");
			    		return;
		          });
		        }else{
		          console.log("already friend");
		          callback("already friend");
		    		return;
		        }
		      });
		    }
		});
	}
}
