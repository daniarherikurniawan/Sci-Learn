var express = require('express');
var router = express.Router();

/*Controller*/
var page_profile_cont = require('../controller/base/paging/page_profile_cont');
var user_cont = require('../controller/base/user_cont');
/* GET home page. */
router.get('/:email', function(req, res, next) {
	if(req.session.profile!=null){
		if(req.params.email == "edit"){
			page_profile_cont.showEditProfilePage(req, res)
		}else{
			page_profile_cont.showPostsSection(req, res, req.params.email, 0, 15, false )
		}
	}else{
		res.redirect('/login');
	}
});

/* GET home page. */
router.get('/:email/:page', function(req, res, next) {
	if(req.session.profile!=null){
		page_profile_cont.showPostsSection(req, res, req.params.email, req.params.page, 15, false )
	}else{
		res.redirect('/login');
	}
});



/* GET home page. */
router.get('/:email/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){
		page_profile_cont.showPostsSection(req, res, req.params.email, req.params.page, req.params.limit, true )
	}else{
		res.redirect('/login');
	}
});

/* POST update profile. */
router.post('/updateProfile', function(req, res) {
	if(req.session.profile != null){
		user_cont.updateProfile(req, res);
	}else{
		res.send('Sorry, you cannot connect update the post!');
	}
});

module.exports = router;
