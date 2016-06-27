var express = require('express');
var router = express.Router();

/*Controller*/
var page_profile_cont = require('../controller/page_profile_cont');

/* GET home page. */
router.get('/:email', function(req, res, next) {
	if(req.session.profile!=null){
		page_profile_cont.showPostsSection(req, res, req.params.email, 0, 15, false )
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

module.exports = router;
