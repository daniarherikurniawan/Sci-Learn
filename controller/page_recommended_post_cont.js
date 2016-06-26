module.exports = { 
	showRecommendedPost: function(req, res){
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
	}
}



