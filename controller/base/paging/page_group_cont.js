
var Group = require('../../../dbhelper/group_model');
var Post = require('../../../dbhelper/post_model');
var User = require('../../../dbhelper/user_model');

// var post_func = require('../../../controller/common/post_func');
// var page_home_func = require('../../../controller/common/paging/page_home_func');

function isInArray(value, array) {
  return array.indexOf(value) > -1;
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

								res.render('group', {group: group_data, showGroupPost:true,
									profile: req.session.profile, 
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

		showGroupCoursesPage: function(group_id, req, res, numOfCurrPage, limit){
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


								res.render('group', {group: group_data, showGroupCourse:true,
									profile: req.session.profile, 
									numOfPost : 0,
									courses: [], numOfLastPage : 0,
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
		}
	
}



