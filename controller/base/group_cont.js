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
				if (err) {
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
				    	// limit: 8
				    }
				})
            .exec(function(err, user_data){
				if (err) {
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
				if (err) {
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
	}
}

