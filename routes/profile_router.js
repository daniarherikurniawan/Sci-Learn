var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multiparty = require('multiparty');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var Client = require('node-rest-client').Client;
var async = require('async');
var requestify = require('requestify'); 
var client = new Client();
var rimraf = require('rimraf');

/*Controller*/
var agent_cont = require('../controller/agent_cont');
var api_cont = require('../controller/api_cont');
var chat_cont = require('../controller/chat_cont');
var connection_cont = require('../controller/connection_cont');
var group_cont = require('../controller/group_cont');
var post_cont = require('../controller/post_cont');
var tutorial_cont = require('../controller/tutorial_cont');
var user_cont = require('../controller/user_cont');


/* GET home page. */
router.get('/:email', function(req, res, next) {
	if(req.session.profile!=null){
		showPostsPage(req, res, req.params.email, 0, 15, false )
	}else{
		res.redirect('/login');
	}
});

/* GET home page. */
router.get('/:email/:page', function(req, res, next) {
	if(req.session.profile!=null){
		showPostsPage(req, res, req.params.email, req.params.page, 15, false )
	}else{
		res.redirect('/login');
	}
});

/* GET home page. */
router.get('/:email/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){
		showPostsPage(req, res, req.params.email, req.params.page, req.params.limit, true )
	}else{
		res.redirect('/login');
	}
});

function showPostsPage(req, res, userEmail, page, limit, isLimitedByParameter ){

    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
	if(re.test(userEmail) && req.session.profile!=null){
		mongoose.model('User').findOne({email:userEmail}, function(err, user){
			if(err){
				console.log(err);
				res.sendStatus('404');
			}else{
				req.session.dataCurrentProfile = user;
				limit = parseInt(limit);
				//res.send(req.session.dataCurrentProfile);
				mongoose.model('Post')
					.find({creator:req.session.dataCurrentProfile._id})
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
					for (var i = posts.length - 1; i >= 0; i--) {
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

					if(req.session.dataCurrentProfile.email == req.session.profile.email){
						//this is my profile
					 numOfPost = req.session.profile.id_share_posts.length+req.session.profile.id_user_posts.length;
					 numOfLastPage = Math.ceil(numOfPost/limit);
						
					 res.render('profile', {profile: req.session.profile,numOfCurrPage : page, 
					 	numOfLastPage : numOfLastPage,  limitPerPage:limit,  numOfPost:numOfPost,
					  	friendProfile: null, rec_topic : req.session.rec_topic, 
					 	popular_topic: req.session.popular_topic,
					  	posts: posts, myFriend : true, page:isLimitedByParameter,
					 	partials: { rightSide:'rightSide', topNavigation:'topNavigation'}});	
					}else{
						numOfPost = req.session.dataCurrentProfile.id_share_posts.length+req.session.dataCurrentProfile.id_user_posts.length;
					 	numOfLastPage = Math.ceil(numOfPost/limit);
						
						var idForProfile = req.session.profile.connections.slice();;
						idForProfile.push(req.session.profile._id);

						if (idForProfile.indexOf(""+req.session.dataCurrentProfile._id) != -1){
					 	res.render('profile', {profile: req.session.profile,
					 		 rec_topic : req.session.rec_topic, page:isLimitedByParameter,
					 		friendProfile: req.session.dataCurrentProfile, numOfPost:numOfPost,
					 		posts: posts, myFriend : true,numOfCurrPage : page, 
					 		popular_topic: req.session.popular_topic,
					 		numOfLastPage : numOfLastPage, limitPerPage:limit,
					 	partials: { rightSide:'rightSide', topNavigation:'topNavigation'}});	

						}else{
					 	res.render('profile', {profile: req.session.profile, numOfCurrPage : page, 
					 		numOfLastPage : numOfLastPage,  limitPerPage:limit,  numOfPost:numOfPost,
					 		friendProfile: req.session.dataCurrentProfile, page:isLimitedByParameter,
					 		popular_topic: req.session.popular_topic, 
					 		posts: posts, myFriend :  false,  rec_topic : req.session.rec_topic,
					 	partials: { rightSide:'rightSide', topNavigation:'topNavigation'}});	

						}
					}
				});
			}
		});			
	}else{
		res.redirect('/login');
	}
}

module.exports = router;
