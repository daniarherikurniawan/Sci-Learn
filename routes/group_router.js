var express = require('express');
var router = express.Router();

var group_cont = require('../controller/base/group_cont');
var page_group_cont = require('../controller/base/paging/page_group_cont');

/* POST home page. */
router.post('/createNewGroup', function(req, res, next) {
	if(req.session.profile!=null){	
		// console.log(req.body)
		group_cont.createGroup(req.body, res);
	}else{
		res.redirect('/login');
	}
});

/* POST home page. */
router.post('/getList', function(req, res, next) {
	if(req.session.profile!=null){	
		group_cont.get_all_list(req.body.user_id, res);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/:group_id', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_group_cont.showGroupPage(req, res, 0, 15);
	}else{
		res.redirect('/login');
	}
});


module.exports = router;
