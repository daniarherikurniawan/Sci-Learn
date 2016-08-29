var express = require('express');
var router = express.Router();

/*Controller*/
var api_cont = require('../controller/base/api_cont');

/* Post getToken page. */
router.get('/', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			res.send("API is ready")
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

router.post('/test/:username', function(req, res, next) {
	api_cont.isApplicationRegistered(req.params.username, req.body.password, function(result){
		res.send(result);
	});
});

router.get('/test', function(req, res, next) {
	res.render('testAngular');
});

/* Post getToken page. */
router.get('/signUp/:email/:name', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.signUp(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.get('/getProfile/:userToken', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.getProfileByToken(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.get('/getProfile/email/:email', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.getProfileByEmail(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.post('/getReccPost', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.getReccPost(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.post('/getTimeLine', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.getTimeLine(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.get('/getRandomPost', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.getRandomPost(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.get('/addFriend/:idUser/:idPeople', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.addFriend(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.post('/getListPeople', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.getListPeople(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.post('/createPost', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.createPost(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.post('/sharePost', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.sharePost(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.post('/commentPost', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.commentPost(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

/* Post getToken page. */
router.post('/likePost', function(req, res, next) {
	api_cont.isApplicationRegistered("daniarheri", "daniarheri", function(isRegistered){
		if (isRegistered){
			api_cont.likePost(req, res);
		}else{
			res.send("Sorry, you have not registered your application to access the API!");
		}
	});
});

module.exports = router;
