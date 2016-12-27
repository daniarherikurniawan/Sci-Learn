
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
	showListBookmarkCategories:  function(user_id, req, res ){
		/*By default showing bookmarked posts */
 		isMyGroups = req.session.profile._id == user_id;
 		if(!isMyGroups)
			match = 'Public Group'
		else
			match = {$in: ['Public Group', 'Private Group']}

 		User.object.findById(user_id)
 			.populate('bookmarks_personal_posts.post')
 			.select('bookmarks_personal_posts')
 			.exec(function(err, data_user){

				if(err || data_user==null){
					console.log(err);
					res.send("404");
				}else{

	 				Post.object.populate(data_user,{
	 					path: 'bookmarks_personal_posts.post.creator bookmarks_personal_posts.post.original_creator',
	 					select: 'name email img_profile_name',
	 					model: User.object
	 				}, function(err, temp_data){
	 					if(err)
	 						console.log(err)

	 					Post.object.populate(temp_data, {
	 						path: 'bookmarks_personal_posts.post.post_shared',
		 					model: Post.object
	 					}, function(err, final_data){
							if(err || final_data==null){
								console.log(err);
								res.send("404");
							}else{

								id = req.session.profile._id;
								if(final_data != null )
									for (var i = final_data.bookmarks_personal_posts.length - 1;  i >= 0; i--) {

										if(final_data.bookmarks_personal_posts[i].post.creator._id == req.session.profile._id){
											 final_data.bookmarks_personal_posts[i].post.creator = null;
										}
										if(final_data.bookmarks_personal_posts[i].post.like.indexOf(id) != -1){
											 final_data.bookmarks_personal_posts[i].post.liked = true;
										}
										if(final_data.bookmarks_personal_posts[i].post.share.indexOf(id) != -1){
											final_data.bookmarks_personal_posts[i].post.shared = true;
										} 
										if((final_data.bookmarks_personal_posts[i].post.creator == null) && 
											(final_data.bookmarks_personal_posts[i].post.post_shared != null)  && 
											(final_data.bookmarks_personal_posts[i].post.post_shared.share.indexOf(id) != -1)){
											final_data.bookmarks_personal_posts[i].post.post_shared.shared = true;
										}
									};


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
									data_bookmarks : final_data.bookmarks_personal_posts,
									showBookmarks: true, showPersonalPostBookmarks : true,
									numOfLastPage : 0, showGroups: false, myFriend: myFriend,
						 			limitPerPage:100,
									friendProfile: friendProfile , rec_topic : req.session.rec_topic, 
									popular_topic: req.session.popular_topic, setting: req.session.setting,
									numOfCurrPage : 0, setting: req.session.setting,
								partials: {group_info:'partial/group_info',
									list_bookmark_categories:'partial/list_bookmark_categories',
									create_group_modal: 'modal/create_group_modal',
									create_course_modal: 'modal/create_course_modal',
									list_course_enrolled:'partial/list_course_enrolled', 
									leftSide: 'partial/leftSide', list_group:'partial/list_group', 
									bookmark_post_partial: 'partial/bookmark_post_partial',
									bookmark_modal: 'modal/bookmark_modal', 
									share_modal: 'modal/share_modal', 
									edit_post_template: 'template/edit_post_template',
									list_course_in_group: 'partial/list_course_in_group',
									post_partial: 'partial/post_partial',
									post_partial_content: 'partial/post_partial_content',
									 topNavigation:'partial/topNavigation'}});
								}
						})
						
				})
						
 			}
			
		})
 	},


 	showListGroupPostBookmarks:  function(user_id, req, res ){
 		isMyGroups = req.session.profile._id == user_id;
 		if(!isMyGroups)
			match = 'Public Group'
		else
			match = {$in: ['Public Group', 'Private Group']}

 		User.object.findById(user_id)
 			.populate('bookmarks_group_posts.post')
 			.populate({
 				path: 'bookmarks_group_posts.group',
 				select: 'group_name img_cover_name group_accessibility'
 				})
 			.select('bookmarks_group_posts')
 			.exec(function(err, data_user){

				if(err || data_user==null){
					console.log(err);
					res.send("404");
				}else{

	 				Post.object.populate(data_user,{
	 					path: 'bookmarks_group_posts.post.creator bookmarks_group_posts.post.original_creator',
	 					select: 'name email img_profile_name',
	 					model: User.object
	 				}, function(err, temp_data){
	 					if(err)
	 						console.log(err)

	 					Post.object.populate(temp_data, {
	 						path: 'bookmarks_group_posts.post.post_shared',
		 					model: Post.object
	 					}, function(err, final_data){
							if(err || final_data==null){
								console.log(err);
								res.send("404");
							}else{

								id = req.session.profile._id;
								if(final_data != null )
									for (var i = final_data.bookmarks_group_posts.length - 1;  i >= 0; i--) {

										if(final_data.bookmarks_group_posts[i].post.creator._id == req.session.profile._id){
											 final_data.bookmarks_group_posts[i].post.creator = null;
										}
										if(final_data.bookmarks_group_posts[i].post.like.indexOf(id) != -1){
											 final_data.bookmarks_group_posts[i].post.liked = true;
										}
										if(final_data.bookmarks_group_posts[i].post.share.indexOf(id) != -1){
											final_data.bookmarks_group_posts[i].post.shared = true;
										} 
										if((final_data.bookmarks_group_posts[i].post.creator == null) && 
											(final_data.bookmarks_group_posts[i].post.post_shared != null)  && 
											(final_data.bookmarks_group_posts[i].post.post_shared.share.indexOf(id) != -1)){
											final_data.bookmarks_group_posts[i].post.post_shared.shared = true;
										}
									};


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
									data_bookmarks : final_data.bookmarks_group_posts,
									showBookmarks: true, showGroupPostBookmarks : true,
									numOfLastPage : 0, showGroups: false, myFriend: myFriend,
						 			limitPerPage:100, showGroupPost: true,
									friendProfile: friendProfile , rec_topic : req.session.rec_topic, 
									popular_topic: req.session.popular_topic, setting: req.session.setting,
									numOfCurrPage : 0, setting: req.session.setting,
								partials: {group_info:'partial/group_info',
									list_bookmark_categories:'partial/list_bookmark_categories',
									create_group_modal: 'modal/create_group_modal',
									create_course_modal: 'modal/create_course_modal',
									list_course_enrolled:'partial/list_course_enrolled', 
									leftSide: 'partial/leftSide', list_group:'partial/list_group', 
									bookmark_post_partial: 'partial/bookmark_post_partial',
									bookmark_modal: 'modal/bookmark_modal', 
									share_modal: 'modal/share_modal', 
									edit_post_template: 'template/edit_post_template',
									list_course_in_group: 'partial/list_course_in_group',
									post_partial: 'partial/post_partial',
									post_partial_content: 'partial/post_partial_content',
									 topNavigation:'partial/topNavigation'}});
								}
						})
						
				})
						
 			}
			
		})
 	},

	
}



