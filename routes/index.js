var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multiparty = require('multiparty');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var im = require('imagemagick');
var lwip = require('lwip');
 
var hash = require("../public/javascripts/sha256.js");

// /* GET home page. */     sdsdc
router.get('/', function(req, res, next) {
	if(req.session.profile!=null){
		showHomePage(req, res, 0, 15);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     sdsdc
router.get('/visdat', function(req, res, next) {
		res.redirect('/visdat/index.html');
});


// /* GET home page. */     sdsdc
router.get('/home/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){
		showHomePage(req, res, req.params.page, req.params.limit);
	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     sdsdc
router.get('/home/:page', function(req, res, next) {
	if(req.session.profile!=null){
		showHomePage(req, res, req.params.page, 15);
	}else{
		res.redirect('/login');
	}
});

function showHomePage(req, res, numOfCurrPage, limit){
	
	var idForHome = req.session.profile.connections.slice();;
	idForHome.push(req.session.profile._id);

	req.app.locals.getPostIdForHome(idForHome, limit, numOfCurrPage, true, function(arrayPostId, numOfPost){
		mongoose.model('Post').find({'_id': {$in : arrayPostId}})
			.sort({date_created: 'desc'})
			.populate({
				  path: 'creator'
				})
			.populate({
				  path: 'original_creator',
				})
			.populate('post_shared')
			.exec(function (err,posts){
				console.log(err);
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
			// console
			mongoose.model('User').findById(req.session.profile._id)
				.populate ('online_connection' )
				.exec (function (err,user){
				if(err){
					console.log(err);
					res.send("404");
				}else{
					req.session.profile = user;

					numOfLastPage = Math.ceil(numOfPost/limit);
					
					if (req.session.profile.connections != null){
						req.app.locals.getReccPost(req.session.profile.connections,
							'asc', true, function(rec_topic){
								// console.log("@@@@@@@@@@@@@@@@@@@@@@@@"+rec_topic.length)
							if(rec_topic!="no_recc_topic"){
								for (var i = rec_topic.length - 1; i > 0; i--) {
									rec_topic[i].ui.index = i;
									rec_topic[i].ui.status = null;
								};
								rec_topic[0].ui.status = "active";
								rec_topic[0].ui.index = 0;
							}else{
								rec_topic = null;
							}

							//popular post
							req.app.locals.getReccPost(req.session.profile.connections,
								'desc', true, function(popular_topic){
									// console.log("@@@@@@@@@@@@@@@@@@@@@@@@"+popular_topic.length)
								if(popular_topic!="no_recc_topic"){
									for (var i = popular_topic.length - 1; i > 0; i--) {
										popular_topic[i].ui.index = i;
										popular_topic[i].ui.status = null;
									};
									popular_topic[0].ui.status = "active";
									popular_topic[0].ui.index = 0;
								}else{
									popular_topic = null;
								}

								req.session.popular_topic = popular_topic;
								req.session.rec_topic = rec_topic;
								res.render('index', {profile: req.session.profile, numOfPost : numOfPost,
									posts: posts, popular_topic: popular_topic, rec_topic: rec_topic, numOfLastPage : numOfLastPage,
									numOfCurrPage : numOfCurrPage,limitPerPage : limit,
								partials: {leftSide:'leftSide', 
								rightSide:'rightSide', topNavigation:'topNavigation'}});	
							});
						});
					}else{
						req.session.rec_topic = null;
						res.render('index', {profile: req.session.profile, numOfPost : numOfPost,
							posts: posts, rec_topic: null, numOfLastPage : numOfLastPage,
							numOfCurrPage : numOfCurrPage, limitPerPage : limit,
						partials: {leftSide:'leftSide', 
						rightSide:'rightSide', topNavigation:'topNavigation'}});
					}
					// console.log("ini "+user.online_connection);
				}
			});
		
		});
	})
}

// /* GET home page. */     sdsdc
router.get('/popularPost', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need paginatio
	if(req.session.profile!=null){
		numOfPost = 0;
		req.app.locals.getReccPost(req.session.profile.connections,
			'asc', true, function(rec_topic){
				// console.log("@@@@@@@@@@@@@@@@@@@@@@@@"+rec_topic.length)
			if(rec_topic!="no_recc_topic"){
				for (var i = rec_topic.length - 1; i > 0; i--) {
					rec_topic[i].ui.index = i;
					rec_topic[i].ui.status = null;
				};
				rec_topic[0].ui.status = "active";
				rec_topic[0].ui.index = 0;
			}else{
				rec_topic = null;
			}

			//popular post
			req.app.locals.getReccPost(req.session.profile.connections,
				'desc', true, function(popular_topic){
					// console.log("@@@@@@@@@@@@@@@@@@@@@@@@"+popular_topic.length)
				if(popular_topic!="no_recc_topic"){
					for (var i = popular_topic.length - 1; i > 0; i--) {
						popular_topic[i].ui.index = i;
						popular_topic[i].ui.status = null;
					};
					popular_topic[0].ui.status = "active";
					popular_topic[0].ui.index = 0;
					numOfPost = popular_topic.length;
				}else{
					popular_topic = null;
				}

				req.session.popular_topic = popular_topic;
				req.session.rec_topic = rec_topic;
				res.render('index', {profile: req.session.profile, numOfPost : numOfPost,
					rec_topic: rec_topic, numOfLastPage : 0,  isPopularPostPage: true,
					numOfCurrPage : -1, limitPerPage : 0, isReccPostPage: false,
					posts: popular_topic, partials: {leftSide:'leftSide', 
				rightSide:'rightSide', topNavigation:'topNavigation'}});	
			});
		});

	}else{
		res.redirect('/login');
	}
});

// /* GET home page. */     sdsdc
router.get('/recommendedPost', function(req, res, next) {
	// limitPerPage == 0, as indicator that we do not need pagination
	if(req.session.profile!=null){
		var numOfPost = 99;
		req.app.locals.getReccPost(req.session.profile.connections,
			'asc', true, function(rec_topic){
			if(rec_topic!="no_recc_topic"){
				for (var i = rec_topic.length - 1; i > 0; i--) {
					rec_topic[i].ui.index = i;
					rec_topic[i].ui.status = null;
				};
				rec_topic[0].ui.status = "active";
				rec_topic[0].ui.index = 0;
				numOfPost = rec_topic.length;
			}else{
				rec_topic = null;
			}

			//popular post
			req.app.locals.getReccPost(req.session.profile.connections,
				'desc', true, function(popular_topic){
				if(popular_topic!="no_recc_topic"){
					for (var i = popular_topic.length - 1; i > 0; i--) {
						popular_topic[i].ui.index = i;
						popular_topic[i].ui.status = null;
					};
					popular_topic[0].ui.status = "active";
					popular_topic[0].ui.index = 0;
				}else{
					popular_topic = null;
				}

				req.session.popular_topic = popular_topic;
				req.session.rec_topic = rec_topic;
				res.render('index', {profile: req.session.profile, numOfPost : numOfPost,
					popular_topic: popular_topic, numOfLastPage : 0,  isPopularPostPage: false,
					numOfCurrPage : -1, limitPerPage : 0, isReccPostPage: true,
					posts: rec_topic, partials: {leftSide:'leftSide', 
				rightSide:'rightSide', topNavigation:'topNavigation'}});		
			});
		});


	}else{
		res.redirect('/login');
	}
});



router.get('/dataUser/:id', function(req, res){
	mongoose.model('User').findById(req.params.id, function(err, user){
		res.send(user);
	});
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

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('login', { Message: '' });
});

/* GET contact. */
router.get('/post/:id', function(req, res) {
	//res.send(req.body);
	if(req.session.profile != null){
		mongoose.model('Post').findById(req.params.id)
			.populate('creator')
			.populate( 'original_creator')
			.exec(function (err,dataPost){
				// console.log(dataPost);
				if(err){
					console.log(err);
					res.send("404");
				}else if(dataPost != null){
					id = req.session.profile._id;
					if(dataPost.like.indexOf(id) != -1){
						 dataPost.liked = true;
					}
					if(dataPost.share.indexOf(id) != -1){
						dataPost.shared = true;
					}
					if((dataPost.creator == null) &&
					 (dataPost.post_shared != null)  && (dataPost.post_shared.share.indexOf(id) != -1)){
						dataPost.post_shared.shared = true;
					}
					if(dataPost.creator._id == req.session.profile._id)
						myPost = true;
					else
						myPost = false;

					res.render('post', {profile: req.session.profile, posts: dataPost, 
						rec_topic : req.session.rec_topic, myPost : myPost,
					partials: {leftSide:'leftSide', rightSide:'rightSide', topNavigation:'topNavigation'}});	
				}else{
					console.log(err);
					res.send("404");
				}
			});
	}else{
		res.redirect('/login');
	}
});

/* POST contact. */
router.post('/dataPost', function(req, res, next) {
	//res.send(req.body);
	mongoose.model('Post').findById(req.body.id)
	.populate({
		  path: 'creator',
		})
	.populate({
		  path: 'original_creator',
		})
	.populate('post_shared')
	.exec(function (err,dataPost){
		if(err){
			console.log(err);
			res.send("404");
		}else	{
			id = req.session.profile._id;
			if(dataPost.creator._id == id){
				 dataPost.creator = null;
			}
			if(dataPost.like.indexOf(id) != -1){
				 dataPost.liked = true;
			}
			if(dataPost.share.indexOf(id) != -1){
				dataPost.shared = true;
			}
			if((dataPost.creator == null) &&
			 (dataPost.post_shared != null)  && (dataPost.post_shared.share.indexOf(id) != -1)){
				dataPost.post_shared.shared = true;
			}
		
			res.send(dataPost);
		}
	});
});

/* POST comments retrieval. */
router.post('/getComment', function(req, res, next) {
	//res.send(req.body);

	mongoose.model('Post').findById(req.body.id, function(err, post){

		mongoose.model('Post').populate(post.comments, {path: 'creator' }, function (err,comments){
				
			if(err){
				console.log(err);
				res.send("404");
			}else{
				res.send(comments);
			}

		});

	});
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
		mongoose.model('User').findById(req.body.id, function(err, user){
		if(err){
			console.log(err);
			res.send("404");
		}else{
			res.send(user);
		}
		});
	}else{
		res.redirect('/login');
	}
});


/* POST profile retrieval. */
router.post('/updateOnlineConnection', function(req, res, next) {
	if(req.session.profile != null){

		// console.log(req.session.profile._id+">>>>>>>>>>>>"+req.body.type+"==============="+req.body.id);
		mongoose.model('User').find({_id : {$in : [req.session.profile._id, req.body.id] } }, function(err, user){
		if(err){
			console.log(err);
			res.send("404");
		}else{
				// console.log("woo  ooy   "+req.session.profile.connections);

			if(user[0]._id == req.session.profile._id)
				req.session.profile = user[0];
			else
				req.session.profile = user[1];

			if(req.session.profile.connections.indexOf(req.body.id) != -1){
				// console.log("wooooy   "+req.body);

				if (req.body.type == "delete"){
					// console.log("delete "+req.body.id );
					for (var i = user.length - 1; i >= 0; i--) {
						if (user[i].online_connection != null){
							
							if(user[i]._id == req.session.profile._id){
								index = user[i].online_connection.indexOf(req.body.id);
								if(index != -1)
									user[i].online_connection.splice(index,1);
							}else{
								index = user[i].online_connection.indexOf(req.session.profile._id);
								if(index != -1)
									user[i].online_connection.splice(index,1);
							}
							user[i].save();
						}
					}
				}

				if (req.body.type == "add"){ //add
					if(req.body.id != req.session.profile._id){
						for (var i = user.length - 1; i >= 0; i--) {
							
							if((user[i]._id == req.session.profile._id)
							 && (user[i].online_connection.indexOf(req.body.id) == -1)){
									user[i].online_connection.push(req.body.id);
							}
							if((user[i]._id != req.session.profile._id)
							 && (user[i].online_connection.indexOf(req.session.profile._id) == -1)){
									user[i].online_connection.push(req.session.profile._id);
							}
							user[i].save();
						};
							// console.log("addddddddddddddddddddddd"+user[i]);

					}
				}
			}
			mongoose.model('User').populate(user, {path: 'online_connection' }, function (err,user){
						
					if(err){
						console.log(err);
						res.send("404");
					}else{
						if(user[0]._id == req.session.profile._id)
							res.send(user[0].online_connection);
						else
							res.send(user[1].online_connection);
					}

				});
			}

		});
	}else{
		res.redirect('/login');
	}
});

/* POST comments retrieval. */
router.post('/getLike', function(req, res, next) {
	//res.send(req.body);

	mongoose.model('Post').findById(req.body.id, function(err, post){

		mongoose.model('Post').populate(post, {path: 'like' }, function (err,post){
				
			if(err){
				console.log(err);
				res.send("404");
			}else{
				res.send(post.like);
			}

		});

	});
});

/* GET un friends retrieval. */
router.get('/unFriend/:id/:email', function(req, res) {
	//res.send(req.body);
	if(req.session.profile != null){
		id = req.params.id;
		mongoose.model('User').findById(req.session.profile._id, function(err, user){
				if(err){
					console.log(err);
					res.send("404");
				}else{
					index = user.connections.indexOf(id);
					if(index != -1){
						user.connections.splice(index,1);
						mongoose.model('User').findById(id, function(err, userx){
							index = userx.connections.indexOf(req.session.profile._id);
							if(index != -1)
								userx.connections.splice(index,1);
							index = userx.online_connection.indexOf(req.session.profile._id);
							if(index != -1)
								userx.online_connection.splice(index,1);
							userx.save();
						});
					}

					index = user.online_connection.indexOf(id);
					if(index != -1)
						user.online_connection.splice(index,1);
					user.save();
					req.session.profile = user;

					var idForHome = req.session.profile.connections.slice();;
					idForHome.push(req.session.profile._id);
					mongoose.model('Post')
						.findOne({$and: [{original_creator: null}, {creator: {$in : idForHome}}]})
						.sort({post_index: 'desc'})
						.populate('creator')
						.exec(function(err,rec_topic){
							req.session.rec_topic = rec_topic;
							res.redirect('/profile/'+req.params.email);	
						});

				}

		});
	}else{
		res.redirect('/login');
	}
});


/* POST comments retrieval. */
router.post('/getShare', function(req, res, next) {
	//res.send(req.body);
	mongoose.model('Post').findById(req.body.id, function(err, post){
		mongoose.model('Post').populate(post, {path: 'share' }, function (err,post){
			if(err){
				console.log(err);
				res.send("404");
			}else{
				res.send(post.share);
			}

		});

	});
});


/* POST like. */
router.post('/addLike', function(req, res, next) {
	mongoose.model('Post').findById(req.body.id,
			function(err, post){
		if(err){
			console.log(err);
			res.send("404");
		}else{
			index = post.like.indexOf(req.session.profile._id);
			if(index != -1){
				req.app.locals.removeLike(req.session.profile._id, req.body.id);

				mongoose.model('User').findById(req.session.profile._id)
				.exec(function(err, user){
					req.session.profile = user;
					res.send("dislike");
				});			
			}else{
				req.app.locals.giveLike(req.session.profile._id, req.body.id);
				
				mongoose.model('User').findById(req.session.profile._id)
				.exec(function(err, user){
					req.session.profile = user;
					res.send("like");
				});		
			}
		}
	});
});

/* POST contact. */
router.post('/addComment', function(req, res, next) {
	req.app.locals.giveComment(req.body.creator, req.body.id, req.body.content);

	mongoose.model('User').findById(req.body.creator)
	.exec(function(err, user){
		req.session.profile = user;
		res.send("success!");
	});	
});


/* POST delete post page. */
router.post('/deleteComment', function(req, res) {
	req.app.locals.removeComment(req.session.profile._id, req.body.post_id, req.body.id);

	mongoose.model('User').findById(req.session.profile._id)
	.exec(function(err, user){
		req.session.profile = user;
		res.send("success");
	});	
});


/* POST like. */
router.post('/addShare', function(req, res, next) {
	req.app.locals.giveShare(req.session.profile._id, req.body.id_post, req.body.original_creator, req.body.content);

	mongoose.model('User').findById(req.session.profile._id)
	.exec(function(err, user){
		req.session.profile = user;
		res.redirect('/');
	});	
});


/* POST contact. */
router.post('/addContact', function(req, res, next) {
	req.app.locals.addContact(req.session.profile._id, req.body.id);
	  var delay=200; //1 seconds
	  setTimeout(function(){
			mongoose.model('User').findById(req.session.profile._id)
			.exec(function(err, user){
				req.session.profile = user;
				// console.log(user.connections);
				res.send(req.body.id);
			});	
	  }, delay); 	
});

/* POST search page. */
router.get('/search/:page/:limit', function(req, res, next) {
	if(req.session.profile != null){
		showSearchPage(req, res, req.params.limit, req.params.page);
	}else{
		res.redirect('/login');
	}
});

/* POST search page. */
router.get('/search/:page', function(req, res, next) {
	if(req.session.profile != null){
		showSearchPage(req, res, 15, req.params.page);
	}else{
		res.redirect('/login');
	}
});

/* POST search page. */
router.get('/search', function(req, res, next) {
	if(req.session.profile != null){
		showSearchPage(req, res, 15, 0);
	}else{
		res.redirect('/login');
	}
});

function showSearchPage(req, res, limit, numOfCurrPage){
	if(req.query.search_term != null)
		search_term = req.query.search_term;
	else
		search_term = '';
		// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
	limit = parseInt(limit);
	numOfCurrPage = parseInt(numOfCurrPage);
	if(req.session.profile!=null){
		if(search_term != ''){
			var idForSearch = req.session.profile.connections.slice();
			idForSearch.push(req.session.profile._id);

			mongoose.model('User').find({
					$and: [
						{ name: new RegExp(search_term, "i")},
						{_id: {$nin : idForSearch}}
					]
				}).sort({date_created: 'desc'})
				.skip(limit*numOfCurrPage)
				.exec(
				function(err, results){
		// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

				res.render('search', {profile: req.session.profile, results: results, numOfPeople: results.length,
					rec_topic : req.session.rec_topic, search_term: search_term, showByQuery : false, 
					popular_topic: req.session.popular_topic,
					partials: {leftSide:'leftSide', rightSide:'rightSide', topNavigation:'topNavigation'}});	
			});
		}else{
			var idForSearch = req.session.profile.connections.slice();
			idForSearch.push(req.session.profile._id);


			mongoose.model('User')
				.find({_id: {$nin : idForSearch} })
				.sort({date_created: 'desc'})
				.skip(limit*numOfCurrPage)
				.limit(limit)
				.exec(
				function(err, results){
				if(err)
					console.log(err)
				mongoose.model('User').count({}, function( err, count){
					count = count -1 -req.session.profile.connections.length;
					numOfLastPage = Math.ceil(count/limit);
					numOfCurrPage =  numOfCurrPage	
					res.render('search', {profile: req.session.profile, results: results, numOfPeople : count,
						rec_topic : req.session.rec_topic, limitPerPage : limit,  search_term: null,
					numOfLastPage: numOfLastPage, numOfCurrPage: numOfCurrPage, showByQuery : true, 
					popular_topic: req.session.popular_topic,
					partials: {leftSide:'leftSide', rightSide:'rightSide', topNavigation:'topNavigation'}});	
				});
				
			});
		}
	}else{
		res.redirect('/login');
	}
}

/* POST saving post page. */
router.post('/addPost', function(req, res) {
	req.app.locals.givePost(req.session.profile._id, req.body.content, req.body.title, req.body.keywords);
	mongoose.model('User').findById(req.session.profile._id, function(err, user){
		req.session.profile = user;	  			
		res.redirect('/');
  	});
});

/* POST delete post page. */
router.post('/deletePost', function(req, res) {
	req.app.locals.removePost(req.session.profile._id, req.body.id);
	
	mongoose.model('User').findById(req.session.profile._id, function(err, user){
		req.session.profile = user;	  			
		res.send(req.body.id);
  	});
});

/* POST update post page. */
router.post('/updatePost/:id/:creator', function(req, res) {
	//res.send(req.body);
	if(req.params.creator == req.session.profile._id){
		var title = req.body.title;
		var keywords = req.body.keywords;
		var content = req.body.content;
		mongoose.model('Post').findOneAndUpdate({_id: req.params.id},
			{title: title , keywords:keywords , content: content}, 
			{upsert:true}, function(err, post){
			if(err) console.log(err);
	  		res.redirect('/');
	  	});
	}else{
	 	res.send('/');
	}
});

/* POST upload_img_profile page. */
router.post('/upload_img_profile', multipartMiddleware, function(req, res) {
	if(req.session.profile != null){
	// 	var tmp_path = req.files.img_profile.path;
	// return res.redirect("/"+tmp_path);

	var img = req.files.img_profile;
	fs.readFile(img.path, function(err, data){
		if(err){
			return res.redirect("/tmpError/"+err);
		}

		var path =  "./public/images/"+req.session.profile.email+"/"
		if (!fs.existsSync(path)){
			fs.mkdirSync(path);
			
		}
		path += "profile/";
		if (!fs.existsSync(path)){
			fs.mkdirSync(path);
		}

		path += img.originalFilename;

		fs.writeFile(path, data, function(error){
			if (error) console.log(error);

			mongoose.model('User').findOneAndUpdate({_id: req.session.profile._id}, {img_profile_name:img.originalFilename}, {upsert:true}, function(err, data){
				if (err){
					return res.send(500, { error: err });
				}else{
					im.crop({
					  srcPath: img.path,
					  dstPath: 'public/images/'+req.session.profile.email+"/profile/"+img.originalFilename,
					  width:   256,
				  	  height: 256,
					}, function(err, stdout, stderr){
					  if (err) {
					  	console.log("/errCrop/"+err);
					  };
						req.session.profile.img_profile_name = img.originalFilename;
						return res.redirect("/profile/"+req.session.profile.email);
					});
				}
			});

		}
		);  
	});
	}else{
  		res.render('login');
  	}
});

/* POST signup page. */
router.post('/signup', function(req, res, next) {
	//
	var email = req.body.email;
	var name = req.body.name;
	var password = req.body.password;
	var confirmed_password = req.body.confirmed_password;
	var token = req.app.locals.createToken();
  	//res.send(req.body);
  	if (confirmed_password === password){
  		mongoose.model('User').findOne({email: email}, function(err, data){
  			if( data != null ) {
  				res.render('login', { Message: 'Email '+email+' is already registered!' });
	        	// do whatever you need to do if it's not there
	        } else {
	        	var path =  "./public/images/"+email+"/"
	        	if (!fs.existsSync(path)){
	        		fs.mkdirSync(path);
	        	}
	        	var pathProfile = path+ "profile/"
	        	if (!fs.existsSync(pathProfile)){
	        		fs.mkdirSync(pathProfile);
	        	}
	        	pathProfile += "profile.jpg"
	        	fs.readFile("./public/images/profile.jpg", function(err, foto){
	        		fs.writeFile(pathProfile, foto, function(error){
	        		});  
	        	});

	        	var pathCover = path+"cover/"
	        	if (!fs.existsSync(pathCover)){
	        		fs.mkdirSync(pathCover);
	        	}
	        	pathCover += "cover.jpg"
	        	fs.readFile("./public/images/cover.jpg", function(err, foto){
	        		fs.writeFile(pathCover, foto, function(error){
	        		});  
	        	});
				password = hash.sha256_digest(password);
	        	var userModel = mongoose.model('User',req.app.locals.UserSchema);
	        	var userObj = new userModel({token: token, name: name, email: email, password: password});
	        	userObj.save();
	        	req.session.profile = userObj;
				res.redirect('/');
			    }
		});
  	}else{
  		res.render('login', { Message: 'Confirmed password is incorrect!' });
  	}
  });

/* Post generateToken page. */
router.post('/generateToken', function(req, res, next) {
	mongoose.model('User').findById(req.session.profile._id, function(err, user){
		user.token = req.app.locals.createToken();
		user.save();
		req.session.profile = user;
		res.send("Token has been generated!")
  	});
});

/* Post getToken page. */
router.get('/getToken', function(req, res, next) {
	res.send(req.session.profile.token);
});


/* GET login page. */
router.get('/logout', function(req, res, next) {
	req.session.destroy();
	res.redirect('/login');
});

/* POST login page. */
router.post('/login', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	password = hash.sha256_digest(password);
	mongoose.model('User').findOne({email: email, password: password},function(err, data){
		if( data == null ) {
			res.render('login', { Message: 'Username or password is incorrect!' });
        	// do whatever you need to do if it's not there
        } else {
        	req.session.profile = data;
        	res.redirect('/');
	        // do whatever you need to if it is there
	    }
	});
});


module.exports = router;
