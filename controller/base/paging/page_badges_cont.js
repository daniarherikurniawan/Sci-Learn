var Course = require('../../../dbhelper/course_model');
var User = require('../../../dbhelper/user_model');

module.exports = { 

 	showListBadges: function(user_id, req, res ){
 		isMyCourse = req.session.profile._id == user_id;
 		if(!isMyCourse)
			match = 'Public Course'
		else
			match = {$in: ['Public Course', 'Private Course']}

 		User.object.findById(user_id)
 			.select('badges')
 			.exec(function(err, data_user){
				if(err || data_user==null){
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
					
					res.render('profile', {profile: req.session.profile, numOfPost : 0,
						posts: [], numOfLastPage : 0, showBadges: true, myFriend: myFriend,
			 			limitPerPage:100, badges: data_user.badges,
						friendProfile: friendProfile , rec_topic : req.session.rec_topic, 
						popular_topic: req.session.popular_topic, setting: req.session.setting,
						numOfCurrPage : 0, setting: req.session.setting,
					partials: {group_info:'partial/group_info', 
						create_group_modal: 'modal/create_group_modal', 
						create_course_modal: 'modal/create_course_modal', leftSide: 'partial/leftSide', 
						list_course_enrolled:'partial/list_course_enrolled', 
						list_badges:'partial/list_badges',
						list_group:'partial/list_group',
						topNavigation:'partial/topNavigation'}});
					}
 			})
			
	},

}



