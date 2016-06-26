var Post = require('../dbhelper/post_model');
var User = require('../dbhelper/user_model');

module.exports = { 
	showHomePage: function(req, res, numOfCurrPage, limit){
		
		var idForHome = req.session.profile.connections.slice();;
		idForHome.push(req.session.profile._id);

		req.app.locals.getPostIdForHome(idForHome, limit, numOfCurrPage, true, function(arrayPostId, numOfPost){
			Post.model
				.find({'_id': {$in : arrayPostId}})
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
				User.model
					.findById(req.session.profile._id)
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
}



