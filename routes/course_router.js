var express = require('express');
var router = express.Router();

var course_cont = require('../controller/base/course_cont');
var page_course_cont = require('../controller/base/paging/page_course_cont');

/* POST saving post. */
router.get('/search/:search_term', function(req, res) {
	if(req.session.profile != null){
		course_cont.searchPublicCourse(req, res);
	}else{
		res.send('Sorry, you cannot search any group!');
	}
});

/* POST home page. */
router.post('/join', function(req, res, next) {
	if(req.session.profile!=null){	
		course_cont.join(req, req.body.course_id, res);
	}else{
		res.redirect('/login');
	}
});

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

// /* GET home page. */     
router.get('/bookmark/:course_id/:week_id/:material_id', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_course_cont.showCourseMaterialBookmarkPage(req.params.course_id, req, res, 
			req.params.week_id, req.params.material_id);
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

// /* GET home page. */     
router.get('/:course_id/participants', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_course_cont.showCourseParticipants(req, res);
	}else{
		res.redirect('/login');
	}
});



router.post('/quickSearchWithinGroupMemberNotInstructor', function(req, res, next) {
	if(req.session.profile!=null){
		course_cont.quickSearchWithinGroupMemberNotInstructor(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});

router.post('/quickSearchWithinGroupMemberNotParticipants', function(req, res, next) {
	if(req.session.profile!=null){
		course_cont.quickSearchWithinGroupMemberNotParticipants(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});


router.post('/quickSearchWithinCourseInstructor', function(req, res, next) {
	if(req.session.profile!=null){
		course_cont.quickSearchWithinCourseInstructor(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});


router.post('/quickSearchWithinCourseStudents', function(req, res, next) {
	if(req.session.profile!=null){
		course_cont.quickSearchWithinCourseStudents(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});

router.post('/membership/addStudent', function(req, res, next) {
	if(req.session.profile!=null){
		course_cont.addStudent(req, res);
	}else{
		res.redirect('/login');
	}
});

router.post('/membership/removeStudent', function(req, res, next) {
	if(req.session.profile!=null){
		course_cont.removeStudent(req, res);
	}else{
		res.redirect('/login');
	}
});

router.post('/membership/addInstructor', function(req, res, next) {
	if(req.session.profile!=null){
		course_cont.addInstructor(req, res);
	}else{
		res.redirect('/login');
	}
});

router.post('/membership/removeInstructor', function(req, res, next) {
	if(req.session.profile!=null){
		course_cont.removeInstructor(req, res);
	}else{
		res.redirect('/login');
	}
});


module.exports = router;
