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


/* GET friends page. */
router.get('/:id', function(req, res, next) {
	showFriendsPage(req, res, req.params.id, 0, 15, false);
});


/* GET friends page. */
router.get('/:id/:page', function(req, res, next) {
	showFriendsPage(req, res, req.params.id, req.params.page, 15, false);
});

/* GET friends page. */
router.get('/:id/:page/:limit', function(req, res, next) {
	// console.log("limiiiit")
	showFriendsPage(req, res, req.params.id, req.params.page, req.params.limit, true);
});

function showFriendsPage(req, res, userId, page, limit, isLimitedByParameter ){
	if(req.session.profile!=null){
		mongoose.model('User').findById(userId)
		.exec(function(err, user){
			if(err){
				console.log(err);
				res.send("404");
			}else{
				//res.send(user);
				limit = parseInt(limit);
				req.session.dataCurrentProfile = user;
				mongoose.model('User')
				.find({_id: {$in : req.session.dataCurrentProfile.connections}})
				.skip(limit*page)
				.limit(limit)
				.exec(function(err, friends){
					console.log(err);
					
					limitPerPage = limit;
					if(	(req.session.profile._id != userId) ){
						numOfFriend = req.session.dataCurrentProfile.connections.length;
						numOfLastPage = Math.ceil(numOfFriend/limit);
						
						if(req.session.profile.connections.indexOf(userId) == -1){
					// console.log("===========");
							// not my friend
							 res.render('profile', {profile: req.session.profile, 
							 	friendProfile: req.session.dataCurrentProfile, numOfCurrPage : page, 
							 	numOfLastPage : numOfLastPage, limitPerPage : limitPerPage,
						 		popular_topic: req.session.popular_topic,
							 	posts: null,  rec_topic : req.session.rec_topic, page:isLimitedByParameter,
							 	 friends : friends, myFriend:false, showFriends:true, numOfFriend : numOfFriend,
							 	partials: { rightSide:'rightSide', topNavigation:'topNavigation'}});
					 	}else{
					// console.log("2");
							 res.render('profile', {profile: req.session.profile, page:isLimitedByParameter,
							 	friendProfile: req.session.dataCurrentProfile,   numOfLastPage : numOfLastPage,
							 	rec_topic : req.session.rec_topic,  numOfCurrPage : page,
							 	limitPerPage : limitPerPage, numOfFriend : numOfFriend,
						 		popular_topic: req.session.popular_topic,
							 	posts: null, friends : friends, myFriend:true,  showFriends:true,
							 	partials: { rightSide:'rightSide', topNavigation:'topNavigation'}});
					 	}
					}else{
					// this is my profile
					numOfFriend = req.session.profile.connections.length;
					numOfLastPage = Math.ceil(req.session.profile.connections.length/limit);
					 res.render('profile', {profile: req.session.profile, page:isLimitedByParameter,
					 	myFriend:true, showFriends:true,  numOfCurrPage : page, numOfLastPage : numOfLastPage,
					 	friendProfile: null, posts: null, limitPerPage : limitPerPage,
						popular_topic: req.session.popular_topic,
					 	friends : friends, rec_topic : req.session.rec_topic, numOfFriend : numOfFriend,
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
