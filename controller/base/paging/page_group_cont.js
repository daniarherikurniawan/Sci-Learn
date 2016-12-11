
var Post = require('../../../dbhelper/post_model');
var User = require('../../../dbhelper/user_model');

// var post_func = require('../../../controller/common/post_func');
// var page_home_func = require('../../../controller/common/paging/page_home_func');


module.exports = { 
	showGroupPage: function(req, res, numOfCurrPage, limit){
			res.render('group', {profile: req.session.profile, numOfPost : 0,
				posts: [], numOfLastPage : 0,
				numOfCurrPage : 0, limitPerPage : limit, setting: req.session.setting,
			partials: {leftSide:'partial/leftSide', share_modal: 'modal/share_modal', rightSide:'partial/rightSide',
			edit_post_template: 'template/edit_post_template', create_group_modal: 'modal/create_group_modal',
			post_partial: 'partial/post_partial', list_group:'partial/list_group',
			 topNavigation:'partial/topNavigation'}});
		}
	
}



