var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');

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
	}
}



