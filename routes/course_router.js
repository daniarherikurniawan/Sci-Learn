var express = require('express');
var router = express.Router();

var course_cont = require('../controller/base/course_cont');

/* POST get list courses. */
router.post('/getList', function(req, res, next) {
	if(req.session.profile!=null){	
		course_cont.get_list_course(req.body.user_id, res);
	}else{
		res.redirect('/login');
	}
});

module.exports = router;
