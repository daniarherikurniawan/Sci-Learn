var express = require('express');
var router = express.Router();

var group_cont = require('../controller/base/group_cont');
var page_group_cont = require('../controller/base/paging/page_group_cont');
var group_post_cont = require('../controller/base/group_post_cont');

/* POST home page. */
router.post('/createNewGroup', function(req, res, next) {
	if(req.session.profile!=null){	
		// console.log(req.body)
		group_cont.createGroup(req, res);
	}else{
		res.redirect('/login');
	}
});

/* POST home page. */
router.post('/getList', function(req, res, next) {
	if(req.session.profile!=null){	
		group_cont.get_list_group(req.body.user_id, req.body.user_id == req.session.profile._id, res);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/:group_id', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_group_cont.showGroupPage(req.params.group_id, req, res, 0, 15);
	}else{
		res.redirect('/login');
	}
});


/* POST delete group. */
router.post('/deleteGroup', function(req, res, next) {
	if(req.session.profile!=null){	
		group_cont.deleteGroup(req.body.group_id, req.session.profile._id, req, res);
	}else{
		res.redirect('/login');
	}
});

/* POST saving post. */
router.post('/addPost', function(req, res) {
	if(req.session.profile != null){
		group_post_cont.addPost(req, res);
	}else{
		res.send('Sorry, you cannot create a new post!');
	}
});
module.exports = router;
