var express = require('express');
var router = express.Router();

/*Controller*/
var page_profile_cont = require('../controller/page_profile_cont');

/* GET home page. */
router.get('/post', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, 0, 15 ,'post')
	}else{
		res.redirect('/login');
	}
});

router.get('/post/:page', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, req.params.page, 15 ,'post')
	}else{
		res.redirect('/login');
	}
});

router.get('/post/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, req.params.page, req.params.limit ,'post')
	}else{
		res.redirect('/login');
	}
});

/* GET home page. */
router.get('/share', function(req, res, next) {
	if(req.session.profile!=null){	
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, 0, 15 ,'share')
	}else{
		res.redirect('/login');
	}
});

router.get('/share/:page', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, req.params.page, 15 ,'share')
	}else{
		res.redirect('/login');
	}
});

router.get('/share/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, req.params.page, req.params.limit ,'share')
	}else{
		res.redirect('/login');
	}
});
/* GET home page. */
router.get('/like', function(req, res, next) {
	if(req.session.profile!=null){	
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, 0, 15 ,'like')
	}else{
		res.redirect('/login');
	}
});

router.get('/like/:page', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, req.params.page, 15 ,'like')
	}else{
		res.redirect('/login');
	}
});

router.get('/like/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, req.params.page, req.params.limit ,'like')
	}else{
		res.redirect('/login');
	}
});
/* GET home page. */
router.get('/comment', function(req, res, next) {
	if(req.session.profile!=null){	
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, 0, 15 ,'comment')
	}else{
		res.redirect('/login');
	}
});

router.get('/comment/:page', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, req.params.page, 15 ,'comment')
	}else{
		res.redirect('/login');
	}
});

router.get('/comment/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		page_profile_cont.showPostsByActivity(req, res, req.session.dataCurrentProfile._id, req.params.page, req.params.limit ,'comment')
	}else{
		res.redirect('/login');
	}
});


module.exports = router;
