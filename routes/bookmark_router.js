var express = require('express');
var router = express.Router();

/*Controller*/
var bookmark_cont = require('../controller/base/bookmark_cont');


router.post('/addPersonalPostBookmark', function(req, res, next) {
	if(req.session.profile!=null){
		bookmark_cont.addPersonalPostBookmark(req, res);
	}else{
		res.redirect('/login');
	}
}); 

router.post('/isInPersonalPostBookmark', function(req, res, next) {
	if(req.session.profile!=null){
		bookmark_cont.isInPersonalPostBookmark(req, res);
	}else{
		res.redirect('/login');
	}
}); 


router.post('/removePersonalPostBookmark', function(req, res, next) {
	if(req.session.profile!=null){
		bookmark_cont.removePersonalPostBookmark(req, res);
	}else{
		res.redirect('/login');
	}
});


router.post('/addGroupPostBookmark', function(req, res, next) {
	if(req.session.profile!=null){
		bookmark_cont.addGroupPostBookmark(req, res);
	}else{
		res.redirect('/login');
	}
});

router.post('/isInGroupPostBookmark', function(req, res, next) {
	if(req.session.profile!=null){
		bookmark_cont.isInGroupPostBookmark(req, res);
	}else{
		res.redirect('/login');
	}
}); 

router.post('/removeGroupPostBookmark', function(req, res, next) {
	if(req.session.profile!=null){
		bookmark_cont.removeGroupPostBookmark(req, res);
	}else{
		res.redirect('/login');
	}
});


router.post('/addCourseMaterialBookmark', function(req, res, next) {
	if(req.session.profile!=null){
		bookmark_cont.addCourseMaterialBookmark(req, res);
	}else{
		res.redirect('/login');
	}
});

router.post('/isInCourseMaterialBookmark', function(req, res, next) {
	if(req.session.profile!=null){
		bookmark_cont.isInCourseMaterialBookmark(req, res);
	}else{
		res.redirect('/login');
	}
}); 

router.post('/removeCourseMaterialBookmark', function(req, res, next) {
	if(req.session.profile!=null){
		bookmark_cont.removeCourseMaterialBookmark(req, res);
	}else{
		res.redirect('/login');
	}
});

module.exports = router;
