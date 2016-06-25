var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multiparty = require('multiparty');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var async = require('async');

/* GET home page. */

/* Post getToken page. */
router.get('/', function(req, res, next) {
	res.render("apiDescription");
});

/* Post getToken page. */
router.get('/signUp/:email/:name', function(req, res, next) {
		// console.log("masukselanjutnya==========");
	req.app.locals.signUp(req.params.email, req.params.name, function (token) {
		if(token==null)
			res.sendStatus(400);
		else
			res.send(token);
    });
});

/* Post getToken page. */
router.get('/getProfile/:userToken', function(req, res, next) {
		// console.log("masukselanjutnya==========");
	req.app.locals.getProfile(req.params.userToken, function (user) {
		if(user==null)
			res.sendStatus(400);
		else
			res.send(user);
    });
});

/* Post getToken page. */
router.get('/getProfile/email/:email', function(req, res, next) {
		// console.log("masukselanjutnya==========");
	req.app.locals.getProfileByEmail(req.params.email, function (user) {
		if(user==null)
			res.sendStatus(400);
		else
			res.send(user);
    });
});

function randomChars(num)
{
    var chars = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < num; i++ )
        chars += possible.charAt(Math.floor(Math.random() * possible.length));

    return chars;
}

/* Post getToken page. */
router.post('/getReccPost', function(req, res, next) {
	req.app.locals.getReccPost(req.body.connections, req.body.sorting_type,
		req.body.isCreatorPopulated, function(rec_topic){
			res.send(rec_topic);
	})
});

/* Post getToken page. */
router.post('/getTimeLine', function(req, res, next) {
	req.app.locals.getPostIdForHome(req.body.connections, 0, 0, true,
		function(arrayPostId, numOfPost){
		if(numOfPost != 0){
			mongoose.model('Post')
			.find({'_id': {$in : arrayPostId}})
			.sort({date_created: 'desc'})
			.limit(req.body.numOfPost)
			.exec(function(err,timeline_posts){
				if (err)
					console.log(err)
				res.send(timeline_posts);
			});
		}else{
			res.send("no_timeline_post");
		}
	});
});

/* Post getToken page. */
router.get('/getRandomPost', function(req, res, next) {
	mongoose.model('Post').count().exec(function(err, count){
	  var random = Math.floor(Math.random() * count);
	  mongoose.model('Post').findOne().skip(random).exec(
	    function (err, result) {
	    	// console.log("###########"+result)

	    	if(result.length != 0)
				res.send(result);
			else
				res.send("no_result")
	  });
	});
});

/* Post getToken page. */
router.get('/addFriend/:idUser/:idPeople', function(req, res, next) {
	req.app.locals.addContact(req.params.idUser, req.params.idPeople);

	res.send("addFriend success");
});

/* Post getToken page. */
router.post('/getListPeople', function(req, res, next) {

	mongoose.model('User').count().exec(function(err, count){
	  var random = Math.floor(Math.random() * count);
	  mongoose.model('User').find({_id: {$nin : req.body.idForSearch} })
		.skip(random)
		.limit(req.body.limit)
		.exec(
	    function (err, result) {
			res.send(result);
	  });
	});
});

/* Post getToken page. */
router.post('/createPost', function(req, res, next) {
	idUser = req.body.idUser;
	content = req.body.content;
	title = req.body.title;
	keywords = req.body.keywords;
	req.app.locals.givePost(idUser, content, title, keywords);
	res.send("createPost success");
});

/* Post getToken page. */
router.post('/sharePost', function(req, res, next) {
	idUser = req.body.idUser;
	idPost = req.body.idPost;
	idOriginalCreator = req.body.idOriginalCreator;
	content = req.body.content;
	req.app.locals.giveShare(idUser, idPost, idOriginalCreator, content);
	res.send("sharePost success");
});

/* Post getToken page. */
router.post('/commentPost', function(req, res, next) {
	idUser = req.body.idUser;
	idPost = req.body.idPost;
	content = req.body.content;
	req.app.locals.giveComment(idUser, idPost, content);
	res.send("commentPost success");
});

/* Post getToken page. */
router.post('/likePost', function(req, res, next) {
	idUser = req.body.idUser;
	idPost = req.body.idPost;
	req.app.locals.giveLike(idUser, idPost);
	res.send("likePost success");
});



module.exports = router;
