var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');
var Group = require('../../dbhelper/group_model');

var page_home_func = require('../../controller/common/paging/page_home_func');
var general_func = require('../../controller/common/general_func');

function calculateUserActivenessFunc(numOfPost, numOfShare, numOfLike, numOfComment, numOfConnections){
  	return ((numOfPost* 20)+(numOfShare* 8)+(numOfLike* 3)+(numOfComment* 5)+numOfConnections);
}

function calculatePostIndexFunc(numOfShare, numOfLike, numOfComment){
  	return ((numOfShare* 3)+(numOfLike* 1)+(numOfComment* 2));
}

module.exports = { 
	isThisMyGroup: function(group_id, my_groups){
		return general_func.isInArray(group_id, my_groups)
	},

	givePostWithCallback: function(group_id, idUser, content, title, keywords, callback){
		var postObj = new Post.model({creator: idUser, content: content, title: title, keywords: keywords, 
			type: {
					is_group_post: true,
					group_id:group_id
				}
		});
	  	postObj.save();
	  	
		/*save inside group table*/
		Group.object.findById(group_id, function(err, group){
				if(err)
					console.log(err)
				group.group_posts.push(postObj._id);
				group.save(function(err){
					if(err)
						console.log(err)
		        callback("success");
		    	return;
				});
      	});
	}
}