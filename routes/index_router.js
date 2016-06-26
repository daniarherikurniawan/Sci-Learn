var express = require('express');
var router = express.Router();

var multiparty = require('multiparty');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/*Controller*/
var connection_cont = require('../controller/connection_cont');
var post_cont = require('../controller/post_cont');
var user_cont = require('../controller/user_cont');
var page_home_cont = require('../controller/page_home_cont');
var page_recommended_post_cont = require('../controller/page_recommended_post_cont');
var page_popular_post_cont = require('../controller/page_popular_post_cont');
var page_post_cont = require('../controller/page_post_cont');
var page_search_cont = require('../controller/page_search_cont');

// /* GET home page. */     sdsdc
router.get('/', function(req, res, next) {
	if(req.session.profile!=null){
		page_home_cont.showHomePage(req, res, 0, 15);
	}else{
		res.redirect('/login');
	}
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	if(req.session.profile!=null){
    	res.redirect('/');
	}else{
		res.render('login', { Message: '' });
	}
});

/* POST login page. */
router.post('/login', function(req, res, next) {
	user_cont.isAccountExist(req, function(feedback){
		if (feedback.status == "exist"){
        	res.redirect('/');
		}else{
			res.render('login', { Message: feedback.message });
		}
	});
});

/* POST signup. */
router.post('/signup', function(req, res, next) {
	user_cont.registerNewUser(req, function(feedback){
		if (feedback.status == "success"){
        	res.redirect('/');
		}else{
			res.render('login', { Message: feedback.message });
		}
	});
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
	if(req.session.profile!=null){
    	res.redirect('/');
	}else{
		res.render('login', { Message: '' });
	}
});

// /* GET home page. */     
router.get('/home/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){
		page_home_cont.showHomePage(req, res, req.params.page, req.params.limit);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/home/:page', function(req, res, next) {
	if(req.session.profile!=null){
		page_home_cont.showHomePage(req, res, req.params.page, 15);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/popularPost', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need paginatio
	if(req.session.profile!=null){
		page_popular_post_cont.showPopularPost(req, res);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     
router.get('/recommendedPost', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		page_recommended_post_cont.showRecommendedPost(req, res);
	}else{
		res.redirect('/login');
	}
});

router.get('/dataUser/:id', function(req, res){
	if(req.session.profile!=null){
		mongoose.model('User').findById(req.params.id, function(err, user){
			res.send(user);
		});
	}else{
		res.redirect('/login');
	}
});

/* GET login page. */
router.get('/chat', function(req, res, next) {
	if(req.session.profile != null){
		res.render('chat', { profile: req.session.profile, 
		partials: {topNavigation:'topNavigation'}});	
	}else{
		res.redirect('/login');
	}
});

/* GET contact. */
router.get('/post/:id', function(req, res) {
	//res.send(req.body);
	if(req.session.profile != null){
		page_post_cont.showPostPage(req, res);
	}else{
		res.redirect('/login');
	}
});

/* POST contact. */
router.post('/dataPost', function(req, res, next) {
	if(req.session.profile != null){
		post_cont.getPost(req, res);
	}else{
		res.send('Sorry, you cannot access the post!');
	}
});

/* POST comments retrieval. */
router.post('/getComment', function(req, res, next) {
	if(req.session.profile != null){
		post_cont.getComment(req, res);
	}else{
		res.send('Sorry, you cannot access the comment insights!');
	}
});

/* POST profile retrieval. */
router.post('/profile', function(req, res, next) {
	//res.send(req.body);
	if(req.session.profile != null){
		res.send(req.session.profile);
	}else{
		res.redirect('/login');
	}
});

/* POST profile retrieval. */
router.post('/user', function(req, res, next) {
	if(req.session.profile != null){
		user_cont.getUser(req, res)
	}else{
		res.redirect('/login');
	}
});

/* POST update online connection retrieval. */
router.post('/updateOnlineConnection', function(req, res, next) {
	if(req.session.profile != null){
		connection_cont.updateOnlineConnection(req, res);
	}else{
		res.redirect('/login');
	}
});

/* POST comments retrieval. */
router.post('/getLike', function(req, res, next) {
	if(req.session.profile != null){
		post_cont.getLike(req, res);
	}else{
		res.send('Sorry, you cannot access the like insights!');
	}
});

/* GET un friends retrieval. */
router.get('/Unconnect/:id/:email', function(req, res) {
	if(req.session.profile != null){
		connection_cont.removeConnection(req, res);
	}else{
		res.redirect('/login');
	}
});

/* POST comments retrieval. */
router.post('/getShare', function(req, res, next) {
	if(req.session.profile != null){
		post_cont.getShare(req, res);
	}else{
		res.send('Sorry, you cannot access the share insights!');
	}
});

/* POST like. */
router.post('/addLike', function(req, res, next) {
	if(req.session.profile != null){
		post_cont.addLike(req, res);
	}else{
		res.send('Sorry, you cannot give like to the post!');
	}
});

/* POST contact. */
router.post('/addComment', function(req, res, next) {
	if(req.session.profile != null){
		post_cont.addComment(req, res);
	}else{
		res.send('Sorry, you cannot give comment to the post!');
	}
});

/* POST delete post page. */
router.post('/deleteComment', function(req, res) {
	if(req.session.profile != null){
		post_cont.deleteComment(req, res);
	}else{
		res.send('Sorry, you cannot delete the comment of the post!');
	}
});

/* POST like. */
router.post('/addShare', function(req, res, next) {
	if(req.session.profile != null){
		post_cont.addShare(req, res);
	}else{
		res.send('Sorry, you cannot share the post!');
	}
});

/* POST contact. */
router.post('/addConnection', function(req, res, next) {
	if(req.session.profile != null){
		connection_cont.addConnection(req, res);
	}else{
		res.send('Sorry, you cannot connect to any user!');
	}
});

/* POST search page. */
router.get('/search/:page/:limit', function(req, res, next) {
	if(req.session.profile != null){
		page_search_cont.showSearchPage(req, res, req.params.limit, req.params.page);
	}else{
		res.redirect('/login');
	}
});

/* POST search page. */
router.get('/search/:page', function(req, res, next) {
	if(req.session.profile != null){
		page_search_cont.showSearchPage(req, res, 15, req.params.page);
	}else{
		res.redirect('/login');
	}
});

/* POST search page. */
router.get('/search', function(req, res, next) {
	if(req.session.profile != null){
		page_search_cont.showSearchPage(req, res, 15, 0);
	}else{
		res.redirect('/login');
	}
});

/* POST saving post page. */
router.post('/addPost', function(req, res) {
	if(req.session.profile != null){
		post_cont.addPost(req, res);
	}else{
		res.send('Sorry, you cannot create a new post!');
	}
});

/* POST delete post page. */
router.post('/deletePost', function(req, res) {
	if(req.session.profile != null){
		post_cont.deletePost(req, res);
	}else{
		res.send('Sorry, you cannot delete the post!');
	}
});

/* POST update post page. */
router.post('/updatePost/:id/:creator', function(req, res) {
	if(req.session.profile != null){
		post_cont.updatePost(req, res);
	}else{
		res.send('Sorry, you cannot connect update the post!');
	}
});

/* POST upload_img_profile page. */
router.post('/upload_img_profile', multipartMiddleware, function(req, res) {
	if(req.session.profile != null){
		user_cont.uploadProfilePicture(req, res);
	}else{
		res.send('Sorry, you cannot upload your profile picture!');
  	}
});

/* Post generateToken page. */
router.post('/generateToken', function(req, res, next) {
	if(req.session.profile != null){
		user_cont.generateToken(req, res);
	}else{
		res.send('Sorry, you cannot generate the token!');
  	}
});

/* Post getToken page. */
router.get('/getToken', function(req, res, next) {
	if(req.session.profile != null){
		user_cont.getToken(req, res);
	}else{
		res.redirect('/login');
  	}
});

/* GET login page. */
router.get('/logout', function(req, res, next) {
	if(req.session.profile != null){
		user_cont.logout(req, res);
	}else{
		res.redirect('/login');
  	}
});

module.exports = router;
