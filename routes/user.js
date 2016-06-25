var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multiparty = require('multiparty');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');


/* GET home page. */
router.get('/post', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		showPostsPage(req, res, req.session.dataCurrentProfile._id, 0, 15 ,'post')
	}else{
		res.redirect('/login');
	}
});

router.get('/post/:page', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		showPostsPage(req, res, req.session.dataCurrentProfile._id, req.params.page, 15 ,'post')
	}else{
		res.redirect('/login');
	}
});

router.get('/post/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		showPostsPage(req, res, req.session.dataCurrentProfile._id, req.params.page, req.params.limit ,'post')
	}else{
		res.redirect('/login');
	}
});

/* GET home page. */
router.get('/share', function(req, res, next) {
	if(req.session.profile!=null){	
		showPostsPage(req, res, req.session.dataCurrentProfile._id, 0, 15 ,'share')
	}else{
		res.redirect('/login');
	}
});

router.get('/share/:page', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		showPostsPage(req, res, req.session.dataCurrentProfile._id, req.params.page, 15 ,'share')
	}else{
		res.redirect('/login');
	}
});

router.get('/share/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		showPostsPage(req, res, req.session.dataCurrentProfile._id, req.params.page, req.params.limit ,'share')
	}else{
		res.redirect('/login');
	}
});
/* GET home page. */
router.get('/like', function(req, res, next) {
	if(req.session.profile!=null){	
		showPostsPage(req, res, req.session.dataCurrentProfile._id, 0, 15 ,'like')
	}else{
		res.redirect('/login');
	}
});

router.get('/like/:page', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		showPostsPage(req, res, req.session.dataCurrentProfile._id, req.params.page, 15 ,'like')
	}else{
		res.redirect('/login');
	}
});

router.get('/like/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		showPostsPage(req, res, req.session.dataCurrentProfile._id, req.params.page, req.params.limit ,'like')
	}else{
		res.redirect('/login');
	}
});
/* GET home page. */
router.get('/comment', function(req, res, next) {
	if(req.session.profile!=null){	
		showPostsPage(req, res, req.session.dataCurrentProfile._id, 0, 15 ,'comment')
	}else{
		res.redirect('/login');
	}
});

router.get('/comment/:page', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		showPostsPage(req, res, req.session.dataCurrentProfile._id, req.params.page, 15 ,'comment')
	}else{
		res.redirect('/login');
	}
});

router.get('/comment/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){	// res.send("post")
		showPostsPage(req, res, req.session.dataCurrentProfile._id, req.params.page, req.params.limit ,'comment')
	}else{
		res.redirect('/login');
	}
});

function showPostsPage(req, res, userId, page, limit, typeActivity ){
	if(req.session.profile!=null){
		mongoose.model('User').findById(userId, function(err, user){
			// console.log(req.session.profile)
			showPost = false;
			showComment = false;
			showLike = false;
			showShare = false;
			if(err){
				console.log(err);
				res.sendStatus('404');
			}else{
				req.session.dataCurrentProfile = user;
				limit = parseInt(limit);
				arrayPostId = new Array();
				switch(typeActivity){
					case('post'):
						showPost = true; urlActivity = "user/post"
						arrayPostId = req.session.dataCurrentProfile.id_user_posts.slice();
						break;
					case('like'):
						showLike = true; urlActivity = "user/like"
						arrayPostId = req.session.dataCurrentProfile.id_liked_posts.slice();
						break;
					case('share'):
						showShare = true; urlActivity = "user/share"
						arrayPostId = req.session.dataCurrentProfile.id_share_posts.slice();
						break;
					case('comment'):
						showComment = true; urlActivity = "user/comment"
						arrayId = new Array();
						arrayPostId = req.session.dataCurrentProfile.id_commented_posts.slice();
						for (var i = arrayPostId.length - 1; i >= 0; i--) {
							arrayId.push(arrayPostId[i].id);
						};
						arrayPostId = arrayId;
						break;
				}
				console.log(showPost+" typeActivity : "+typeActivity)

				mongoose.model('Post')
					.find({'_id': {$in : arrayPostId}})
					.skip(limit*page)
					.limit(limit)
					.sort({date_created: 'desc'})
					.populate({
						  path: 'creator',
						})
					.populate({
						  path: 'original_creator',
						})
					.populate('post_shared')
					.exec(function (err,posts){
						id = req.session.profile._id;
						if(posts != null )
							for (var i = posts.length - 1;  i >= 0; i--) {

								if(posts[i].creator._id == req.session.profile._id){
									 posts[i].creator = null;
								}
								if(posts[i].like.indexOf(id) != -1){
									 posts[i].liked = true;
								}
								if(posts[i].share.indexOf(id) != -1){
									posts[i].shared = true;
								} 
								if((posts[i].creator == null) && (posts[i].post_shared != null)  && (posts[i].post_shared.share.indexOf(id) != -1)){
									posts[i].post_shared.shared = true;
								}
							};
					
						var idForProfile = req.session.profile.connections.slice();
						idForProfile.push(req.session.profile._id);
						numOfPost = (page*limit)+posts.length;
						numOfLastPage = Math.ceil(arrayPostId.length/limit);

						if (idForProfile.indexOf(""+req.session.dataCurrentProfile._id) != -1){
							// profile owner 
					 	res.render('profile', {profile: req.session.profile,
					 		 rec_topic : req.session.rec_topic, showPost : showPost,  urlActivity: urlActivity,
					 		 showComment : showComment, showLike : showLike, showShare : showShare,
					 		friendProfile: null, numOfPost:numOfPost,
					 		posts: posts, myFriend : true, numOfCurrPage : page, page : true,
					 		popular_topic: req.session.popular_topic, showPerActivity : true,
					 		numOfLastPage : numOfLastPage, limitPerPage:limit,
					 	partials: { rightSide:'rightSide', topNavigation:'topNavigation'}});	

						}else{
					 	res.render('profile', {profile: req.session.profile, numOfCurrPage : page, showPost : showPost, 
							showLike : showLike, showShare : showShare, showComment : showComment,
					 		numOfLastPage : numOfLastPage,  limitPerPage:limit,  numOfPost:numOfPost,
					 		friendProfile: req.session.dataCurrentProfile, page : true, urlActivity: urlActivity,
					 		popular_topic: req.session.popular_topic, showPerActivity : true,
					 		posts: posts, myFriend :  false,  rec_topic : req.session.rec_topic,
					 	partials: { rightSide:'rightSide', topNavigation:'topNavigation'}});	

						}
					
				});
			}
		});			
	}else{
		res.redirect('/login');
	}
}

module.exports = router;
