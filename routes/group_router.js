var express = require('express');
var router = express.Router();

var group_cont = require('../controller/base/group_cont');

/* POST home page. */
router.post('/create', function(req, res, next) {
	if(req.session.profile!=null){	
		group_cont.createGroup(req.body.user_id, res);
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

module.exports = router;
