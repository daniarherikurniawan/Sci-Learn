var express = require('express');
var router = express.Router();

var group_cont = require('../controller/base/group_cont');

/* GET home page. */
router.post('/create', function(req, res, next) {
	if(req.session.profile!=null){	
		group_cont.createGroup(req.body, res);
	}else{
		res.redirect('/login');
	}
});

module.exports = router;
