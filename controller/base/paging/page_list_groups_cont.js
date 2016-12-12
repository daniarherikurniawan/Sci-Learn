var Group = require('../../../dbhelper/group_model');
var User = require('../../../dbhelper/user_model');

module.exports = { 

 	showListGroupsPage: function(user_id, req, res ){
 		User.object.findById(user_id)
 			.exec(function(err, data_user){
				if(err){
					console.log(err);
					res.send("404");
				}else{
					Group.object.find({_id: {$in: data_user.groups}})
						.exec( function(err, group_data){
							if(err){
								console.log(err);
								res.send("404");
							}else{
								if(req.session.dataCurrentProfile == undefined)
									req.session.dataCurrentProfile = req.session.profile;

								myFriend = (req.session.profile.connections.slice().indexOf(""+req.session.dataCurrentProfile._id) != -1);
								friendProfile = req.session.dataCurrentProfile

								// my profile
								if ((user_id == req.session.profile._id)){
									friendProfile = null;
									myFriend = true;
								}

								res.render('profile', {group: group_data, profile: req.session.profile, numOfPost : 0,
									posts: [], numOfLastPage : 0, showGroups: true, myFriend: myFriend,
						 			limitPerPage:100, 
									friendProfile: friendProfile , rec_topic : req.session.rec_topic, 
									popular_topic: req.session.popular_topic, setting: req.session.setting,
									numOfCurrPage : 0, setting: req.session.setting,
								partials: {group_info:'partial/group_info', share_modal: 'modal/share_modal', group_member:'partial/group_member',
								edit_post_template: 'template/edit_post_template', create_group_modal: 'modal/create_group_modal',
								create_course_modal: 'modal/create_course_modal', list_course_in_group:'partial/list_course_in_group',
								leftSide: 'partial/leftSide', rightSide:'partial/rightSide',
								post_partial: 'partial/post_partial', list_group:'partial/list_group', list_course_in_group: 'partial/list_course_in_group',
								 topNavigation:'partial/topNavigation'}});
							}
						});
				}
 			})
			
	}

}



