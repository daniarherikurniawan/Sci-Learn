
var Course = require('../../../dbhelper/course_model');
var Group = require('../../../dbhelper/group_model');
var Post = require('../../../dbhelper/post_model');
var User = require('../../../dbhelper/user_model');

// var post_func = require('../../../controller/common/post_func');
// var page_home_func = require('../../../controller/common/paging/page_home_func');

function isInArray(value, array) {
	for (var i = array.length - 1; i >= 0; i--) {
		if( array[i] == value){
			return true;
		}
	}
	return false;
}


module.exports = { 
	showGroupPage: function(group_id, req, res, numOfCurrPage, limit){
		if(!isInArray(group_id, req.session.profile.groups)){
			res.redirect('/');
		}else{
			Group.object.findById(group_id)
				.exec( function(err, group_data){
					if(err || group_data == null){
						console.log(err);
						res.send("404");
					}else{
						arrayPostId = group_data.group_posts;
						// console.log("================= "+arrayPostId.length)
						Post.object
						.find({'_id': {$in : arrayPostId}})
						.sort({date_created: 'desc'})
						.populate({
							  path: 'creator',
							  select: 'name email img_profile_name'
							})
						.exec(function (err,posts){
							if(err)
								console.log(err);

							id = req.session.profile._id;
							if(posts != null )
								for (var i = posts.length - 1;  i >= 0; i--) {

									if(posts[i].creator._id == req.session.profile._id){
										 posts[i].creator = null;
									}
									if(posts[i].like.indexOf(id) != -1){
										 posts[i].liked = true;
									}
									if((posts[i].creator == null) && (posts[i].post_shared != null)  && (posts[i].post_shared.share.indexOf(id) != -1)){
										posts[i].post_shared.shared = true;
									}
								};

								isGroupAdmin = isInArray(req.session.profile._id, group_data.group_admin)

								res.render('group', {group: group_data, showGroupPost:true,
									profile: req.session.profile, isGroupAdmin: isGroupAdmin,
									numOfPost : arrayPostId.length,
									posts: posts, numOfLastPage : 0,
									numOfCurrPage : 0, limitPerPage : limit, setting: req.session.setting,
								partials: {group_info:'partial/group_info', share_modal: 'modal/share_modal', group_member:'partial/group_member',
									edit_post_template: 'template/edit_post_template', create_group_modal: 'modal/create_group_modal',
									create_course_modal: 'modal/create_course_modal', 
									post_partial: 'partial/post_partial', list_group:'partial/list_group', list_course_in_group: 'partial/list_course_in_group',
									topNavigation:'partial/topNavigation'}});

							});

					}
				});
			}
		},

		showGroupMembersPage: function(group_id, req, res, numOfCurrPage, limit){
		if(!isInArray(group_id, req.session.profile.groups)){
			res.redirect('/');
		}else{
			Group.object.findById(group_id)
				.populate({
					  path: 'group_members',
					  select: 'name email img_profile_name'
					}
				)
				.populate({
					  path: 'group_admin',
					  select: 'name email img_profile_name'
					}
				)
				.exec( function(err, group_data){
					if(err || group_data == null){
						console.log(err);
						res.send("404");
					}else{
						isGroupAdmin = false;
						for (var i = group_data.group_admin.length - 1; i >= 0; i--) {
							if(group_data.group_admin[i]._id == req.session.profile._id)
								isGroupAdmin = true;
						}
						
						// console.log('isGroupAdmin '+isGroupAdmin)
						res.render('group', {group: group_data, showGroupMemberDetail:true,
							profile: req.session.profile, isGroupAdmin: isGroupAdmin,
							numOfPost : 0, numOfLastPage : 0,
							numOfCurrPage : 0, limitPerPage : limit, setting: req.session.setting,
						partials: {group_info:'partial/group_info', share_modal: 'modal/share_modal', group_member:'partial/group_member',
							edit_post_template: 'template/edit_post_template', create_group_modal: 'modal/create_group_modal',
							per_group_member_detail: 'partial/per_group_member_detail',
							add_group_admin_modal: 'modal/add_group_admin_modal',
							remove_group_admin_modal: 'modal/remove_group_admin_modal',
							add_group_member_modal: 'modal/add_group_member_modal',
							remove_group_member_modal: 'modal/remove_group_member_modal',
							create_course_modal: 'modal/create_course_modal', group_member_detail: 'partial/group_member_detail',
							post_partial: 'partial/post_partial', list_group:'partial/list_group', list_course_in_group: 'partial/list_course_in_group',
							topNavigation:'partial/topNavigation'}});
					}
				});
			}
		},

		showGroupMembersResultSearchPage: function(group_id,  search_term, req, res, numOfCurrPage, limit){
		if(!isInArray(group_id, req.session.profile.groups)){
			res.redirect('/');
		}else{
			Group.object.findById(group_id)
				.populate({
					  	path: 'group_members',
						match: {'name': new RegExp(search_term, "i")},
					  	select: 'name email img_profile_name'
					}
				)
				.exec( function(err, group_data){
					if(err || group_data == null){
						console.log(err);
						res.send("404");
					}else{
						isGroupAdmin = (group_data.group_admin.indexOf(req.session.profile._id) != -1)
						
						console.log('isGroupAdmin '+isGroupAdmin)
						res.render('group', {group: group_data, showSearchMemberResult:true,
							profile: req.session.profile, isGroupAdmin: isGroupAdmin,
							numOfPost : 0, numOfLastPage : 0, search_term_for_group_member: search_term,
							numOfCurrPage : 0, limitPerPage : limit, setting: req.session.setting,
						partials: {group_info:'partial/group_info', share_modal: 'modal/share_modal', group_member:'partial/group_member',
							edit_post_template: 'template/edit_post_template', create_group_modal: 'modal/create_group_modal',
							per_group_member_detail: 'partial/per_group_member_detail',
							add_group_admin_modal: 'modal/add_group_admin_modal',
							remove_group_admin_modal: 'modal/remove_group_admin_modal',
							add_group_member_modal: 'modal/add_group_member_modal',
							remove_group_member_modal: 'modal/remove_group_member_modal',
							create_course_modal: 'modal/create_course_modal', group_member_detail: 'partial/group_member_detail',
							post_partial: 'partial/post_partial', list_group:'partial/list_group', list_course_in_group: 'partial/list_course_in_group',
							topNavigation:'partial/topNavigation'}});
					}
				});
			}
		},

		showGroupCoursesPage: function(group_id, req, res, numOfCurrPage, limit){

 		isMyGroup = isInArray(group_id, req.session.profile.groups);
 		if(!isMyGroup)
			match = 'Public Course'
		else
			match = {$in: ['Public Course', 'Private Course']}

 		Group.object.findById(group_id)
 			.exec(function(err, data_group){
				if(err || data_group==null){
					console.log(err);
					res.send("404");
				}else{
					Course.object.find({
						$and:[
								{'_id': {$in: data_group.courses_id}},
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
								// if ((user_id == req.session.profile._id)){
								// 	friendProfile = null;
								// 	myFriend = true;
								// }
							

								res.render('group', {group: data_group, showGroupCourse:true,
									profile: req.session.profile,  myFriend: myFriend,
						 			limitPerPage:100, list_course_detail: list_course_detail,
									friendProfile: friendProfile , rec_topic : req.session.rec_topic, 
									popular_topic: req.session.popular_topic, setting: req.session.setting,
									numOfCurrPage : 0, setting: req.session.setting,
								partials: {group_info:'partial/group_info', share_modal: 'modal/share_modal',
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



