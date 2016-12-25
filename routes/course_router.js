var express = require('express');
var router = express.Router();

var course_cont = require('../controller/base/course_cont');
var page_course_cont = require('../controller/base/paging/page_course_cont');

/* POST get list courses. */
router.post('/getList', function(req, res, next) {
	if(req.session.profile!=null){	
		course_cont.get_list_course(req.body.user_id, (req.body.user_id == req.session.profile._id),  res);
	}else{
		res.redirect('/login');
	}
});

/* POST home page. */
router.post('/createNewCourse', function(req, res, next) {
	if(req.session.profile!=null){	
		// console.log(req.body)
		course_cont.createCourse(req, res);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/:course_id', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_course_cont.showCoursePage(req.params.course_id, req, res, 0, 15);
	}else{
		res.redirect('/login');
	}
});


/* POST home page. */
router.post('/material/updateCourseOverview', function(req, res, next) {
	if(req.session.profile!=null){	
		// console.log(req.body)
		course_cont.updateCourseOverview(req, res);
	}else{
		res.redirect('/login');
	}
});


/* POST home page. */
router.post('/material/updateMaterialDesc', function(req, res, next) {
	if(req.session.profile!=null){	
		// console.log(req.body)
		course_cont.updateMaterialDesc(req, res);
	}else{
		res.redirect('/login');
	}
});

/* POST home page. */
router.post('/material/editWeeklyMaterial', function(req, res, next) {
	if(req.session.profile!=null){	
		// console.log(req.body)
		course_cont.editWeeklyMaterial(req, res);
	}else{
		res.redirect('/login');
	}
});


/* POST home page. */
router.post('/material/addWeeklyMaterial', function(req, res, next) {
	if(req.session.profile!=null){	
		// console.log(req.body)
		course_cont.addWeeklyMaterial(req, res);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/week/:week_id', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_course_cont.showWeeklyMaterials( req, res);
	}else{
		res.redirect('/login');
	}
});


// /* GET home page. */     
router.get('/week/:week_id/:material_id', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_course_cont.showSpecificMaterial(req, res);
	}else{
		res.redirect('/login');
	}
});

module.exports = router;
