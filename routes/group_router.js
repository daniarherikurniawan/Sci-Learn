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

// /* GET home page. */     
router.get('/members/:group_id', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_group_cont.showGroupMembersPage(req.params.group_id, req, res, 0, 15);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/courses/:group_id', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_group_cont.showGroupCoursesPage(req.params.group_id, req, res, 0, 15);
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


/* POST like. */
router.post('/addLike', function(req, res, next) {
	if(req.session.profile != null){
		group_post_cont.addLike(req, res);
	}else{
		res.send('Sorry, you cannot give like to the post!');
	}
});

/* POST contact. */
router.post('/addComment', function(req, res, next) {
	if(req.session.profile != null){
		group_post_cont.addComment(req, res);
	}else{
		res.send('Sorry, you cannot give comment to the post!');
	}
});

/* POST like. */
router.post('/addShare', function(req, res, next) {
	if(req.session.profile != null){
		group_post_cont.addShare(req, res);
	}else{
		res.send('Sorry, you cannot share the post!');
	}
});

/* POST delete post page. */
router.post('/deletePost', function(req, res) {
	if(req.session.profile != null){
		group_post_cont.deletePost(req, res);
	}else{
		res.send('Sorry, you cannot delete the post!');
	}
});

/* POST delete post group. */
router.post('/deleteComment', function(req, res) {
	if(req.session.profile != null){
		group_post_cont.deleteComment(req, res);
	}else{
		res.send('Sorry, you cannot delete the comment of the post!');
	}
});

	
router.post('/quickSearchWithinOwnGroup', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.quickSearchWithinOwnGroup(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});

	
router.post('/quickSearchWithinGroupMember', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.quickSearchWithinGroupMember(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});

	
router.post('/quickSearchWithinGroupAdmin', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.quickSearchWithinGroupAdmin(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});


router.post('/quickSearchWithinGroupMemberNotAdmin', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.quickSearchWithinGroupMemberNotAdmin(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});
	
router.post('/quickSearchWithinGroupCourse', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.quickSearchWithinGroupCourse(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/members/:group_id/:search_term', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_group_cont.showGroupMembersResultSearchPage(req.params.group_id, req.params.search_term, req, res, 0, 15);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/courses/:group_id/:search_term', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		group_cont.fullSearchWithinGroupCourse(req.params.group_id, req.params.search_term, req, res, 0, 15);
	}else{
		res.redirect('/login');
	}
});

router.post('/membership/addMember', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.addMember(req, res);
	}else{
		res.redirect('/login');
	}
});

router.post('/membership/removeMember', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.removeMember(req, res);
	}else{
		res.redirect('/login');
	}
});

router.post('/membership/addAdmin', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.addAdmin(req, res);
	}else{
		res.redirect('/login');
	}
});

router.post('/membership/removeAdmin', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.removeAdmin(req, res);
	}else{
		res.redirect('/login');
	}
});

router.post('/searchConnectionsThatIsNotGroupMember', function(req, res, next) {
	if(req.session.profile!=null){
		group_cont.searchConnectionsThatIsNotGroupMember(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});

/* POST get list courses. */
router.post('/getListCoursePerGroup', function(req, res, next) {
	if(req.session.profile!=null){	
		group_cont.getListCoursePerGroup(req, res);
	}else{
		res.redirect('/login');
	}
});

module.exports = router;
