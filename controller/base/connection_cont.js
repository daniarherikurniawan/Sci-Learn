var User = require('../../dbhelper/user_model');
var Post = require('../../dbhelper/post_model');

var connection_func = require('../../controller/common/connection_func');

module.exports = { 
	updateOnlineConnection: function(req, res){
		User.model
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
			User.model
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
		User.model
			.findById(req.session.profile._id, function(err, user){
				if(err){
					console.log(err);
					res.send("404");
				}else{
					index = user.connections.indexOf(id);
					if(index != -1){
						user.connections.splice(index,1);
						User.model
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
					Post.model
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
			User.model.findById(req.session.profile._id)
			.exec(function(err, user){
				req.session.profile = user;
				res.send(req.body.id);
			});	
		});
	},

	showConnectionsPage: function(req, res, userId, page, limit, isLimitedByParameter ){
		User.model.findById(userId)
		.exec(function(err, user){
			if(err){
				console.log(err);
				res.send("404");
			}else{
				//res.send(user);
				limit = parseInt(limit);
				req.session.dataCurrentProfile = user;
				User.model
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
							 	list_user : friends, myFriend:false, showFriends:true, numOfFriend : numOfFriend,
							 	partials: { rightSide:'partial/rightSide', list_user:'partial/list_user',
							 	about_user: 'partial/about_user',
							 	list_group:'partial/list_group',create_group_modal: 'modal/create_group_modal',
							 	topNavigation:'partial/topNavigation'}});
					 	}else{
					// console.log("2");
							 res.render('profile', {profile: req.session.profile, page:isLimitedByParameter,
							 	friendProfile: req.session.dataCurrentProfile,   numOfLastPage : numOfLastPage,
							 	rec_topic : req.session.rec_topic,  numOfCurrPage : page,
							 	limitPerPage : limitPerPage, numOfFriend : numOfFriend,
						 		popular_topic: req.session.popular_topic,
							 	posts: null, list_user : friends, myFriend:true,  showFriends:true,
							 	partials: { rightSide:'partial/rightSide', list_user:'partial/list_user',
							 	about_user: 'partial/about_user',
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
						popular_topic: req.session.popular_topic,
					 	list_user : friends, rec_topic : req.session.rec_topic, numOfFriend : numOfFriend,
					 	partials: { rightSide:'partial/rightSide', list_user:'partial/list_user',
						about_user: 'partial/about_user',	
					 	list_group:'partial/list_group',create_group_modal: 'modal/create_group_modal',
					 	topNavigation:'partial/topNavigation'}});	
					}
				});
			}
		});
	}

}