
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
 		isMyGroups = req.session.profile._id == user_id;
 		if(!isMyGroups)
			match = 'Public Group'
		else
			match = {$in: ['Public Group', 'Private Group']}

 		User.object.findById(user_id)
 			.populate('bookmarks_personal_posts.post')
 			.populate('bookmarks_personal_posts.post.creator')
 			.select('bookmarks_personal_posts')
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
						data_bookmarks : data_user.bookmarks_personal_posts,
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
						list_course_in_group: 'partial/list_course_in_group',
						 topNavigation:'partial/topNavigation'}});
				}
						
 			})
			
		}
	
}



