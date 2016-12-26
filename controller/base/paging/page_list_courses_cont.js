var Course = require('../../../dbhelper/course_model');
var User = require('../../../dbhelper/user_model');

module.exports = { 

 	showListCoursesPage: function(user_id, req, res ){
 		isMyCourse = req.session.profile._id == user_id;
 		if(!isMyCourse)
			match = 'Public Course'
		else
			match = {$in: ['Public Course', 'Private Course']}

 		User.object.findById(user_id)
 			.exec(function(err, data_user){
				if(err || data_user==null){
					console.log(err);
					res.send("404");
				}else{
					Course.object.find({
						$and:[
								{'_id': {$in: data_user.courses}},
								{'course_accessibility': match}
							]
						})
						.select('group_id course_name course_info img_cover_name course_accessibility course_students course_instructors date_created')
						.populate({
							path:'course_instructors',
							select:'name email img_profile_name',
							options: {
						    	// limit: 7
						    }
						})
						.exec( function(err, list_course_detail){
							if(err){
								console.log(err);
								res.send("404");
							}else{
								for (var i = list_course_detail.length - 1; i >= 0; i--) {
									if(list_course_detail[i].course_instructors.length > 7){
										list_course_detail[i].course_instructors.splice(7, list_course_detail[i].course_instructors.length-7)
									}
								}
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
									posts: [], numOfLastPage : 0, showCourses: true, myFriend: myFriend,
						 			limitPerPage:100, list_course_detail: list_course_detail,
									friendProfile: friendProfile , rec_topic : req.session.rec_topic, 
									popular_topic: req.session.popular_topic, setting: req.session.setting,
									numOfCurrPage : 0, setting: req.session.setting,
								partials: {group_info:'partial/group_info', 
									create_group_modal: 'modal/create_group_modal', 
									create_course_modal: 'modal/create_course_modal', leftSide: 'partial/leftSide', 
									list_course_enrolled:'partial/list_course_enrolled', list_course_detail:'partial/course/list_course_detail',
									list_group:'partial/list_group',
									topNavigation:'partial/topNavigation'}});
							}
						});
				}
 			})
			
	},

}



