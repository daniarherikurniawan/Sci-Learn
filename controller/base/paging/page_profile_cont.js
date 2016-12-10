var Post = require('../../../dbhelper/post_model');
var User = require('../../../dbhelper/user_model');

module.exports = { 
	showPostsSection: function (req, res, userEmail, page, limit, isLimitedByParameter ){

	    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    
		if(re.test(userEmail) && req.session.profile!=null){
			User.model.findOne({email:userEmail}, function(err, user){
				if(err){
					console.log(err);
					res.sendStatus('404');
				}else{
					req.session.dataCurrentProfile = user;
					limit = parseInt(limit);
					//res.send(req.session.dataCurrentProfile);
					Post.model
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
						 	popular_topic: req.session.popular_topic, setting: req.session.setting,
						  	posts: posts, myFriend : true, page:isLimitedByParameter, 
						 	partials: { rightSide:'partial/rightSide', topNavigation:'partial/topNavigation',
						 		post_partial: 'partial/post_partial', about_user: 'partial/about_user',	
					 			list_group:'partial/list_group', create_group_modal: 'modal/create_group_modal',
						 		share_modal: 'modal/share_modal', edit_post_template: 'template/edit_post_template'
						 }});	
						}else{
							numOfPost = req.session.dataCurrentProfile.id_share_posts.length+req.session.dataCurrentProfile.id_user_posts.length;
						 	numOfLastPage = Math.ceil(numOfPost/limit);
							
							var idForProfile = req.session.profile.connections.slice();;
							idForProfile.push(req.session.profile._id);
							if (idForProfile.indexOf(""+req.session.dataCurrentProfile._id) != -1){
								console.log("MY FRIEND!!!")
							 	res.render('profile', {profile: req.session.profile,
							 		 rec_topic : req.session.rec_topic, page:isLimitedByParameter,
							 		friendProfile: req.session.dataCurrentProfile, numOfPost:numOfPost,
							 		posts: posts, myFriend : true,numOfCurrPage : page, 
							 		popular_topic: req.session.popular_topic, setting: req.session.setting,
							 		numOfLastPage : numOfLastPage, limitPerPage:limit,
							 	partials: { rightSide:'partial/rightSide', topNavigation:'partial/topNavigation',
							 		post_partial: 'partial/post_partial',about_user: 'partial/about_user',	
						 			list_group:'partial/list_group', create_group_modal: 'modal/create_group_modal',
							 		share_modal: 'modal/share_modal', edit_post_template: 'template/edit_post_template'
							 	}});	

							}else{
								console.log("NOT MY FRIEND!!!")
							 	res.render('profile', {profile: req.session.profile, numOfCurrPage : page, 
							 		numOfLastPage : numOfLastPage,  limitPerPage:limit,  numOfPost:numOfPost,
							 		friendProfile: req.session.dataCurrentProfile, page:isLimitedByParameter,
							 		popular_topic: req.session.popular_topic, setting: req.session.setting,
							 		posts: posts, myFriend :  false,  rec_topic : req.session.rec_topic,
							 	partials: { rightSide:'partial/rightSide', topNavigation:'partial/topNavigation',
							 		post_partial: 'partial/post_partial', about_user: 'partial/about_user',	
						 			list_group:'partial/list_group', create_group_modal: 'modal/create_group_modal',
							 		share_modal: 'modal/share_modal', edit_post_template: 'template/edit_post_template'
							 	}});	

							}
						}
					});
				}
			});			
		}else{
			res.redirect('/login');
		}
	},


 	showPostsByActivity: function(req, res, userId, page, limit, typeActivity ){
			User.model.findById(userId, function(err, user){
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

					Post.model
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
							if(req.session.dataCurrentProfile.email == req.session.profile.email){
							//this is my profile
						 		res.render('profile', {profile: req.session.profile,
						 		rec_topic : req.session.rec_topic, showPost : showPost,  urlActivity: urlActivity,
						 		showComment : showComment, showLike : showLike, showShare : showShare,
						 		friendProfile: false, numOfPost:numOfPost, setting: req.session.setting,
						 		posts: posts, myFriend : true, numOfCurrPage : page, page : true,
						 		popular_topic: req.session.popular_topic, showPerActivity : true,
						 		numOfLastPage : numOfLastPage, limitPerPage:limit,
						 		partials: { rightSide:'partial/rightSide', topNavigation:'partial/topNavigation',
						 			post_partial: 'partial/post_partial', about_user: 'partial/about_user',	
					 				list_group:'partial/list_group', create_group_modal: 'modal/create_group_modal',
							 		share_modal: 'modal/share_modal', edit_post_template: 'template/edit_post_template'
							 	}});		
							}else if (idForProfile.indexOf(""+req.session.dataCurrentProfile._id) != -1){
						 		res.render('profile', {profile: req.session.profile,
						 		rec_topic : req.session.rec_topic, showPost : showPost,  urlActivity: urlActivity,
						 		showComment : showComment, showLike : showLike, showShare : showShare,
						 		friendProfile: req.session.dataCurrentProfile, numOfPost:numOfPost,
						 		posts: posts, myFriend : true, numOfCurrPage : page, page : true,
						 		popular_topic: req.session.popular_topic, showPerActivity : true,
						 		numOfLastPage : numOfLastPage, limitPerPage:limit, setting: req.session.setting,
						 		partials: { rightSide:'partial/rightSide', topNavigation:'partial/topNavigation',
						 			post_partial: 'partial/post_partial', about_user: 'partial/about_user',	
					 				list_group:'partial/list_group', create_group_modal: 'modal/create_group_modal',
							 		share_modal: 'modal/share_modal', edit_post_template: 'template/edit_post_template'
							 	}});		
							}else{
						 		res.render('profile', {profile: req.session.profile, numOfCurrPage : page, showPost : showPost, 
								showLike : showLike, showShare : showShare, showComment : showComment,
						 		numOfLastPage : numOfLastPage,  limitPerPage:limit,  numOfPost:numOfPost,
						 		friendProfile: req.session.dataCurrentProfile, page : true, urlActivity: urlActivity,
						 		popular_topic: req.session.popular_topic, showPerActivity : true, setting: req.session.setting,
						 		posts: posts, myFriend :  false,  rec_topic : req.session.rec_topic,
						 		partials: { rightSide:'partial/rightSide', topNavigation:'partial/topNavigation',
						 			post_partial: 'partial/post_partial', about_user: 'partial/about_user',	
					 				list_group:'partial/list_group', create_group_modal: 'modal/create_group_modal',
							 		share_modal: 'modal/share_modal', edit_post_template: 'template/edit_post_template'
							 	}});			
							}
						
					});
				}
			});			
	}

}



