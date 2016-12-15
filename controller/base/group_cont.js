var fs = require('fs');
var im = require('imagemagick');
var rimraf = require('rimraf');
var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');
var Group = require('../../dbhelper/group_model');
// var Chat = require('../../dbhelper/chat_model');
// var async = require("async");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function deleteItemInArray(item, array){
	var index = array.indexOf(item);
	if (index > -1) {
	    array.splice(index, 1);
	}
	return array;
}

module.exports = {

	get_by_id: function(id, res){
		Group.object
			.findById(id)
			.exec(function(err, Group){
				if (err || Group == null) {
					response.setFailedResponse(res, err);
				} else {
					response.setSucceededResponse(res, Group);
				}
				return ;
		})
	},

    get_list_group: function(user_id, isMyGroups, res){
					console.log(user_id)
		if(!isMyGroups)
			match = {'group_accessibility':'Public Group'}
		else
			match = {'group_accessibility':{$in: ['Public Group', 'Private Group']}}

        User.object.findById(user_id)
            .select('groups')
            .populate({
					path:'groups',
					select:'group_name group_accessibility',
					match: match,
					options: {
				    	limit: 8
				    }
				})
            .exec(function(err, user_data){
				if (err || user_data == null) {
					response.setFailedResponse(res, "failed");
				} else {
					response.setSucceededResponse(res, user_data.groups);
				}
                return ;
            })
    },

    get_group_by_id: function(user_id, res){
        Group.object
            .find()
            .select('group_name')
            .exec(function(err, all_Group){
				if (err || all_Group == null) {
					response.setFailedResponse(res, err);
				} else {
					response.setSucceededResponse(res, all_Group);
				}
                return ;
            })
    },

	delete: function(Group_email, res){
		Group.object.remove({Group_email: Group_email}, function(err) {
			if (err) {
				response.setFailedResponse(res, err);
			} else {
				response.setSucceededResponse(res, Group_email + " has been deleted");
			}
		})
	},

	createGroup: function(req, res){
		group_members  = req.body.group_members.split(",");
		req.body.group_members = group_members;
		// console.log(group_members)
		var GroupObj = new Group.model(req.body);
	    GroupObj.save(function(err){
			if (err) {
				response.setFailedResponse(res, err);
			} else {
				var path =  "./public/groups/"+GroupObj._id+"/"
	        	if (!fs.existsSync(path)){
	        		fs.mkdirSync(path);
	        	}
	        	var pathGroupProfile = path+ "about/"
	        	if (!fs.existsSync(pathGroupProfile)){
	        		fs.mkdirSync(pathGroupProfile);
	        	}

	        	randomIdImage  = getRandomInt(1, 29);

	        	pathGroupProfile += "group_cover.jpg"
	        	fs.readFile("./public/template/"+randomIdImage+"_group_cover.jpg", function(err, foto){
	        		fs.writeFile(pathGroupProfile, foto, function(error){
	        		});  
	        	});
					
				User.object.find({_id : {$in : group_members }})
					.select('groups')
					.exec(function (err,group_members){
						for (var i = group_members.length - 1; i >= 0; i--) {
							group_members[i].groups.push(GroupObj._id);
							group_members[i].save();
						}
						req.session.profile.groups.push(GroupObj._id);
						response.setSucceededResponse(res, {'group_id':GroupObj._id});
					});
			}
			return ;
		});
	},

	update: function(req, res){
		Group.object.findOneAndUpdate({_id: req.id},
			req,
			{upsert:true}, 
			function(err){
				if (err) {
					response.setFailedResponse(res, err);
				} else {
					response.setSucceededResponse(res, req.id + " has been updated");
				}
	  	});
	},

	deleteGroup: function(group_id, admin_id, req, res){
		Group.object.findById(group_id)
			.exec(function(err, data_group){
				if (err) {
					response.setFailedResponse(res, err);
				} else {
					/*check if the user is an admin*/
					if(admin_id, data_group.group_admin){
						if(data_group.group_posts.length != 0 || data_group.courses_id.length != 0){
							response.setFailedResponse(res, "Delete failed! The group is already has post or either course");
						}else{
							User.object.find({_id: {$in: data_group.group_members}})
								.select('groups')
								.exec(function(err, members){
									if (err) {
										response.setFailedResponse(res, err);
									} else {
										for (var i = members.length - 1; i >= 0; i--) {
											members[i].groups = deleteItemInArray(data_group._id, members[i].groups);
											members[i].save();
										}
										/*update session*/
										deleteItemInArray( data_group._id, req.session.profile.groups);

										data_group.remove();
										/*remove folder*/
										var path =  "public/groups/"+data_group._id+"/"		        	
										rimraf(path, function(err){
												if(err)
													console.log(err)
										    	response.setSucceededResponse(res, "Group is deleted successfully!");
											})
									}
								})
						}
					}else{
						response.setFailedResponse(res, "Delete failed! You are not an admin");
					}
				}
			});
	},

	quickSearchWithinOwnGroup: function(req, callback){
		search_term = req.body.search_term;
		profile_id = req.body.profile_id;
		// console.log('profile_id '+profile_id)

		/*Is it my group?*/
		if(profile_id == req.session.profile._id)
			group_accessibility = {$in: ["Private Group", "Public Group"]}
		else
			group_accessibility = "Public Group"

		// callback(search_term)
		if(search_term == null || search_term == '')
			callback([]);
		else{
			User.object.findById( profile_id)
				.populate({
					path:'groups',
					select:'group_name group_accessibility',
					match: { $and:[
						{'group_name': new RegExp(search_term, "i")},
						{'group_accessibility' : group_accessibility}
					]},
					options: {
				    	limit: 8
				    }
				})
				.exec(
				function(err, results){
					// console.log(group_accessibility+" "+search_term)
					callback(results.groups)
				});
		}
	},

	quickSearchWithinGroupMember: function(req, callback){
		search_term = req.body.search_term;
		group_id = req.body.group_id;
		console.log('group_id '+group_id+ " "+search_term)
		// callback(search_term)
		if(search_term == null || search_term == '')
			callback([]);
		else{
			Group.object.findById(group_id)
				.populate({
					path:'group_members',
					select:'name email',
					match: {'name': new RegExp(search_term, "i")},
					options: {
				    	limit: 8
				    }
				})
				.exec(
				function(err, results){
					if(err)
						console.log(err)
					callback(results.group_members)
				});
		}
	},

	quickSearchWithinGroupAdmin: function(req, callback){
		search_term = req.body.search_term;
		group_id = req.body.group_id;

		if(search_term == null || search_term == '')
			callback([]);
		else{
			Group.object.findById(group_id)
				.populate({
					path:'group_admin',
					select:'name email',
					match: {'name': new RegExp(search_term, "i")},
					options: {
				    	limit: 8
				    }
				})
				.exec(
				function(err, results){
					if(err)
						console.log(err)
					callback(results.group_admin)
				});
		}
	},

	addMember: function(req, res){
		group_id = req.body.group_id;
		user_id = req.body.user_id;
		members_id = req.body.members_id.split(",");
		Group.object
			.findById(group_id)
			.select('group_members group_admin')
			.exec(function(err, data_group){
				if (err || data_group == null) {
					console.log('err '+err)
					console.log('data_group '+data_group)
					response.setFailedResponse(res, err);
				} else {
					isGroupAdmin = (data_group.group_admin.indexOf(user_id) != -1)
					if(!isGroupAdmin){
						response.setFailedResponse(res, "You're not an admin!");
					}else{
						for (var i = members_id.length - 1; i >= 0; i--) {
							data_group.group_members.push(members_id[i])
						}

						data_group.save()

						User.object.find({_id : {$in : members_id }})
						.select('groups')
						.exec(function (err,group_members){
							for (var i = group_members.length - 1; i >= 0; i--) {
								group_members[i].groups.push(data_group._id);
								group_members[i].save();
							}
							response.setSucceededResponse(res, {'group_id':data_group._id});
						});
					}
				}
				return ;
		})
	},

	removeMember: function(req, res){
		group_id = req.body.group_id;
		user_id = req.body.user_id;
		members_id = req.body.members_id.split(",");
		Group.object
			.findById(group_id)
			.select('group_members group_admin')
			.exec(function(err, data_group){
				if (err || data_group == null) {
					response.setFailedResponse(res, err);
				} else {
					isGroupAdmin = (data_group.group_admin.indexOf(user_id) != -1)
					if(!isGroupAdmin){
						response.setFailedResponse(res, "You're not an admin!");
					}else{
						for (var i = members_id.length - 1; i >= 0; i--) {
							data_group.group_members = deleteItemInArray(members_id[i], data_group.group_members)
						}
						data_group.save()
						User.object.find({_id: {$in: members_id}})
							.select('groups')
							.exec(function(err, members){
								if (err) {
									response.setFailedResponse(res, err);
								} else {
									for (var i = members.length - 1; i >= 0; i--) {
										members[i].groups = deleteItemInArray(data_group._id, members[i].groups);
										members[i].save();
									}
									response.setSucceededResponse(res, {'group_id':data_group._id});
								}
							})
					}
				}
				return ;
		})
	},

	addAdmin: function(req, res){
		group_id = req.body.group_id;
		user_id = req.body.user_id;
		members_id = req.body.members_id.split(",");
		Group.object
			.findById(group_id)
			.select('group_members group_admin')
			.exec(function(err, data_group){
				if (err || data_group == null) {
					response.setFailedResponse(res, err);
				} else {
					isGroupAdmin = (data_group.group_admin.indexOf(user_id) != -1)
					if(!isGroupAdmin){
						response.setFailedResponse(res, "You're not an admin!");
					}else{
						for (var i = members_id.length - 1; i >= 0; i--) {
							if(isInArray(members_id, data_group.group_members))
								data_group.group_admin.push(members_id[i])
						}
						data_group.save()
						response.setSucceededResponse(res, "New admin has been added!");
					}
				}
				return ;
		})
	},

	removeAdmin: function(req, res){
		group_id = req.body.group_id;
		user_id = req.body.user_id;
		members_id = req.body.members_id.split(",");
		if(isInArray(user_id, members_id)){
			response.setFailedResponse(res, "You cannot remove yourself from admin position!");
		}else{
			Group.object
				.findById(group_id)
				.select('group_admin')
				.exec(function(err, data_group){
					if (err || data_group == null) {
						response.setFailedResponse(res, err);
					} else {
						isGroupAdmin = (data_group.group_admin.indexOf(user_id) != -1)
						if(!isGroupAdmin){
							response.setFailedResponse(res, "You're not an admin!");
						}else{
							for (var i = members_id.length - 1; i >= 0; i--) {
								data_group.group_admin = deleteItemInArray(members_id[i], data_group.group_admin)
							}
							data_group.save()
							response.setSucceededResponse(res, "The admin has been removed!");
						}
					}
					return ;
			})
		}
	},

	searchConnectionsThatIsNotGroupMember: function(req, callback){
		search_term = req.body.search_term;
		group_id = req.body.group_id;

		if(search_term == null || search_term == '')
			callback([]);
		else{
			Group.object.findById(group_id)
				.select('group_members')
				.exec(function(err, data_group){
					if (err || data_group == null) {
						console.log(err)
						callback([]);
					} else {
						// console.log("req.session.profile.connections "+ req.session.profile.connections)
						// console.log(" data_group.group_members"+data_group.group_members )
						// console.log(" search_term"+search_term )
						User.object.find({$and: [
								{_id: {$in: req.session.profile.connections}},
								{_id: {$nin: data_group.group_members}},
								{name: new RegExp(search_term, "i")}
							]
							})
							.select('name email')
							.limit(8)
							.exec(function (err, connections){
								if(err || connections == null){
									console.log(err)
									callback([])
								}else{
									callback(connections)
								}
							});
					}
				});
		}
	},
}

