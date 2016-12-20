var User = require('../../dbhelper/user_model');
var Post = require('../../dbhelper/post_model');

var connection_func = require('../../controller/common/connection_func');

module.exports = { 
	updateOnlineConnection: function(req, res){
		User.object
			.find({_id : {$in : [req.session.profile._id, req.body.id] } }, 
				function(err, user){
		if(err){
			console.log(err);
			res.send("404");
		}else{
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
					}
				}
			}
			User.object
				.populate(user, {path: 'online_connection' }, 
					function (err,user){	
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
	},

	removeConnection: function(req, res){
		id = req.params.id;
		User.object
			.findById(req.session.profile._id, function(err, user){
				if(err){
					console.log(err);
					res.send("404");
				}else{
					index = user.connections.indexOf(id);
					if(index != -1){
						user.connections.splice(index,1);
						User.object
							.findById(id, function(err, userx){
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
					Post.object
						.findOne({$and: [{original_creator: null}, {creator: {$in : idForHome}}]})
						.sort({post_index: 'desc'})
						.populate('creator')
						.exec(function(err,rec_topic){
							req.session.rec_topic = rec_topic;
							res.redirect('/profile/'+req.params.email);	
						});
				}
		});
	},

	addConnection: function( req, res){
		connection_func.addConnection(req.session.profile._id, req.body.id, 
		function(feedback){
			User.object.findById(req.session.profile._id)
			.exec(function(err, user){
				if(err){
					console.log(err);
					res.send("404");
				}else if(user != null){
					req.session.profile = user;
				}
				res.send(req.body.id);
			});	
		});
	},

	showConnectionsPage: function(req, res, userId, page, limit, isLimitedByParameter ){

		User.object.findById(userId)
		.exec(function(err, user){
			if(err || user== null){
				console.log(err);
				res.send("404");
			}else{
				//res.send(user);
				limit = parseInt(limit);
				req.session.dataCurrentProfile = user;
				User.object
				.find({_id: {$in : req.session.dataCurrentProfile.connections}})
				.skip(limit*page)
				.limit(limit)
				.exec(function(err, friends){
					if(err)
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
						 		popular_topic: req.session.popular_topic, search_term:'',
						 		setting: req.session.setting,
							 	posts: null,  rec_topic : req.session.rec_topic, page:isLimitedByParameter,
							 	list_user : friends, myFriend:false, showFriends:true, numOfFriend : numOfFriend,
							 	partials: { rightSide:'partial/rightSide',list_course_enrolled: 'partial/list_course_enrolled', list_user:'partial/list_user',
							 	about_user: 'partial/about_user',leftSide:'partial/leftSide',
							 	list_group:'partial/list_group',create_group_modal: 'modal/create_group_modal',
							 	topNavigation:'partial/topNavigation'}});
					 	}else{
					// console.log("2");
							 res.render('profile', {profile: req.session.profile, page:isLimitedByParameter,
							 	friendProfile: req.session.dataCurrentProfile,   numOfLastPage : numOfLastPage,
							 	rec_topic : req.session.rec_topic,  numOfCurrPage : page,
							 	limitPerPage : limitPerPage, numOfFriend : numOfFriend,
						 		popular_topic: req.session.popular_topic, search_term:'',
						 		setting: req.session.setting,
							 	posts: null, list_user : friends, myFriend:true,  showFriends:true,
							 	partials: { rightSilist_course_enrolled: 'partial/list_course_enrolled', list_user:'partial/list_user',
							 	about_user: 'partial/about_user',leftSide:'partial/leftSide',
							 	list_group:'partial/list_group',create_group_modal: 'modal/create_group_modal',
							 	topNavigation:'partial/topNavigation'}});
					 	}
					}else{
					// this is my profile
					numOfFriend = req.session.profile.connections.length;
					numOfLastPage = Math.ceil(req.session.profile.connections.length/limit);
					 res.render('profile', {profile: req.session.profile, page:isLimitedByParameter,
					 	myFriend:true, showFriends:true,  numOfCurrPage : page, numOfLastPage : numOfLastPage,
					 	friendProfile: null, posts: null, limitPerPage : limitPerPage,
						popular_topic: req.session.popular_topic, search_term:'',
						setting: req.session.setting,
					 	list_user : friends, rec_topic : req.session.rec_topic, numOfFriend : numOfFriend,
					 	partials: { list_course_enrolled: 'partial/list_course_enrolled', list_user:'partial/list_user',
						about_user: 'partial/about_user',	leftSide:'partial/leftSide',
					 	list_group:'partial/list_group',create_group_modal: 'modal/create_group_modal',
					 	topNavigation:'partial/topNavigation'}});	
					}
				});
			}
		});
	},

	searchNewConnection: function(req, callback){
		search_term = req.body.search_term;
		// callback(search_term)
		if(search_term == null || search_term == '')
			callback([]);
		else{
			limit = 8;
			var idForSearch = req.session.profile.connections.slice();
			idForSearch.push(req.session.profile._id);

			User.object.find({
					$and: [
						{ name: new RegExp(search_term, "i")},
						{_id: {$nin : idForSearch}}
					]
				})
				.select('name email')
				.sort({date_created: 'desc'})
				.limit(limit)
				.exec(
				function(err, results){
					callback(results)
				});
		}
	},

	quickSearchWithinConnection: function(req, callback){
		search_term = req.body.search_term;
		profile_id = req.body.profile_id;
		console.log('profile_id '+profile_id)
		// callback(search_term)
		if(search_term == null || search_term == '')
			callback([]);
		else{
			User.object.findById( profile_id)
				.populate({
					path:'connections',
					select:'name email date_created',
					match: {'name': new RegExp(search_term, "i")},
					options: {
				    	limit: 8
				    }
				})
				.exec(
				function(err, results){
					callback(results.connections)
				});
		}
	},

	quickSearchNewMemberGroup: function(req, callback){
		search_term = req.body.search_term;
		profile_id = req.body.profile_id;
		console.log('profile_id '+profile_id)
		// callback(search_term)
		if(search_term == null || search_term == '')
			callback([]);
		else{
			User.object.findById( profile_id)
				.populate({
					path:'connections',
					select:'name email date_created img_profile_name',
					match: {'name': new RegExp(search_term, "i")},
					options: {
				    	limit: 8
				    }
				})
				.exec(
				function(err, results){
					callback(results.connections)
				});
		}
	},

	fullSearchWithinConnection: function(req, res, userId, search_term, page, limit, isLimitedByParameter ){
		User.object.findById(userId)
		.exec(function(err, user){
			if(err){
				console.log(err);
				res.send("404");
			}else{
				limit = parseInt(limit);
				req.session.dataCurrentProfile = user;
				User.object
					.find({
						$and: [
							{ name: new RegExp(search_term, "i")},
							{_id: {$in : req.session.dataCurrentProfile.connections}}
						]
					})
					.skip(limit*page)
					.select('name email img_profile_name occupation education activeness')
					.limit(limit)
					.exec(function(err, friends){
					if(err)	
						console.log(err);
	
					User.object.find({
							$and: [
								{ name: new RegExp(search_term, "i")},
								{_id: {$in : req.session.dataCurrentProfile.connections}}
							]
						}).count(function(err, count){
							limitPerPage = limit;
							if(	(req.session.profile._id != userId) ){
								numOfFriend = count;
								numOfLastPage = Math.ceil(numOfFriend/limit);
								
								if(req.session.profile.connections.indexOf(userId) == -1){
							// console.log("===========");
									// not my friend
									 res.render('profile', {profile: req.session.profile, 
									 	friendProfile: req.session.dataCurrentProfile, numOfCurrPage : page, 
									 	numOfLastPage : numOfLastPage, limitPerPage : limitPerPage,
										setting: req.session.setting,
								 		popular_topic: req.session.popular_topic, search_term:search_term,
									 	posts: null,  rec_topic : req.session.rec_topic, page:isLimitedByParameter,
									 	list_user : friends, myFriend:false, showFriends:true, numOfFriend : numOfFriend,
									 	partials: { list_course_enrolled: 'partial/list_course_enrolled', list_user:'partial/list_user',
										 	about_user: 'partial/about_user', leftSide:'partial/leftSide',
										 	list_group:'partial/list_group',create_group_modal: 'modal/create_group_modal',
										 	topNavigation:'partial/topNavigation'}});
							 	}else{
							// console.log("2");
									 res.render('profile', {profile: req.session.profile, page:isLimitedByParameter,
									 	friendProfile: req.session.dataCurrentProfile,   numOfLastPage : numOfLastPage,
									 	rec_topic : req.session.rec_topic,  numOfCurrPage : page,
									 	limitPerPage : limitPerPage, numOfFriend : numOfFriend,
										setting: req.session.setting,
								 		popular_topic: req.session.popular_topic,search_term:search_term,
									 	posts: null, list_user : friends, myFriend:true,  showFriends:true,
									 	partials: { list_course_enrolled: 'partial/list_course_enrolled', list_user:'partial/list_user',
										 	about_user: 'partial/about_user', leftSide:'partial/leftSide',
										 	list_group:'partial/list_group',create_group_modal: 'modal/create_group_modal',
										 	topNavigation:'partial/topNavigation'}});
							 	}
							}else{
							// this is my profile
							numOfFriend = count;
							numOfLastPage = Math.ceil(numOfFriend/limit);
							 res.render('profile', {profile: req.session.profile, page:isLimitedByParameter,
							 	myFriend:true, showFriends:true,  numOfCurrPage : page, numOfLastPage : numOfLastPage,
							 	friendProfile: null, posts: null, limitPerPage : limitPerPage,
										setting: req.session.setting,
								popular_topic: req.session.popular_topic,search_term:search_term,
							 	list_user : friends, rec_topic : req.session.rec_topic, numOfFriend : numOfFriend,
							 	partials: { list_course_enrolled: 'partial/list_course_enrolled', list_user:'partial/list_user',
									about_user: 'partial/about_user',	 leftSide:'partial/leftSide',
								 	list_group:'partial/list_group',create_group_modal: 'modal/create_group_modal',
								 	topNavigation:'partial/topNavigation'}});	
							}

						}
					);
				});
			}
		});
	},

}