var express = require('express');
var router = express.Router();

var group_cont = require('../controller/base/group_cont');

/* GET home page. */
router.post('/group/create', function(req, res, next) {
	if(req.session.profile!=null){	// 
		res.send("post")
		// group_cont.createGroup(req.session.dataCurrentProfile._id, 0, 15 ,'post')
	}else{
		res.redirect('/login');
	}
});

module.exports = router;
