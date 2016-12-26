var User = require('../../dbhelper/user_model');


function isInArray(value, array) {
	for (var i = array.length - 1; i >= 0; i--) {
		if( array[i] == value){
			return true;
		}
	}
	return false;
}

function deleteItemInArray(item, array){
	var index = array.indexOf(item);
	if (index > -1) {
	    array.splice(index, 1);
	}
	return array;
}


module.exports = { 
	addPersonalPostBookmark: function(req, res){
		User.object.findById(req.session.profile._id)
			.select( 'bookmarks_personal_posts')
			.exec( function(err, data){
			if(err ||  data == null ) {
				response.setFailedResponse(res, err);
	        } else {
	        	data.bookmarks_personal_posts.push({
	        		notes : req.body.notes,
					post: req.body.post_id
	        	})
	        	req.session.profile.bookmarks_personal_posts = data.bookmarks_personal_posts;
	        	data.save();
				response.setSucceededResponse(res, "Succesfully bookmarking a personal post!");
		    }
		});
	},

	isInPersonalPostBookmark: function(req, res){
		found = false;
		for (var i = req.session.profile.bookmarks_personal_posts.length - 1;!found && i >= 0; i--) {
			if(req.body.post_id == req.session.profile.bookmarks_personal_posts[i].post){
				bookmark_data = req.session.profile.bookmarks_personal_posts[i];
				found = true;
			}
		}
		if(found)
			response.setSucceededResponse(res, {isInArray : true, bookmark_data: bookmark_data});
		else
			response.setSucceededResponse(res, {isInArray : false});
	},

	removePersonalPostBookmark: function(req, res){
		bookmark_id = req.body.bookmark_id;
		User.object.findById(req.session.profile._id)
			.select( 'bookmarks_personal_posts')
			.exec( function(err, data){
			if(err ||  data == null ) {
				response.setFailedResponse(res, err);
	        } else {
	        	found = false;
	        	for (var i = data.bookmarks_personal_posts.length - 1; !found && i >= 0; i--) {
	        		if( data.bookmarks_personal_posts[i]._id == bookmark_id){
	        			found = true;
	        			data.bookmarks_personal_posts.splice(i, 1)
	        		}
	        	}
	        	req.session.profile.bookmarks_personal_posts = data.bookmarks_personal_posts;
	        	data.save();
				response.setSucceededResponse(res, "Succesfully remove a bookmark from a personal post!");
		    }
		});
	},

	addGroupPostBookmark: function(req, res){
		User.object.findById(req.session.profile._id)
			.select( 'bookmarks_group_posts')
			.exec( function(err, data){
			if(err ||  data == null ) {
				response.setFailedResponse(res, err);
	        } else {
	        	data.bookmarks_group_posts.push({
	        		notes : req.body.notes,
					group: req.body.group_id,
					post: req.body.post_id
	        	})
	        	req.session.profile.bookmarks_group_posts = data.bookmarks_group_posts;
	        	data.save();
				response.setSucceededResponse(res, "Succesfully bookmarking a group post!");
		    }
		});
	},

	isInGroupPostBookmark: function(req, res){
		found = false;
		for (var i = req.session.profile.bookmarks_group_posts.length - 1;!found && i >= 0; i--) {
			if(req.body.post_id == req.session.profile.bookmarks_group_posts[i].post){
				bookmark_data = req.session.profile.bookmarks_group_posts[i];
				found = true;
			}
		}
		if(found)
			response.setSucceededResponse(res, {isInArray : true, bookmark_data: bookmark_data});
		else
			response.setSucceededResponse(res, {isInArray : false});
	},

	removeGroupPostBookmark: function(req, res){
		bookmark_id = req.body.bookmark_id;
		User.object.findById(req.session.profile._id)
			.select( 'bookmarks_group_posts')
			.exec( function(err, data){
			if(err ||  data == null ) {
				response.setFailedResponse(res, err);
	        } else {
	        	found = false;
	        	for (var i = data.bookmarks_group_posts.length - 1; !found && i >= 0; i--) {
	        		if( data.bookmarks_group_posts[i]._id == bookmark_id){
	        			found = true;
	        			data.bookmarks_group_posts.splice(i, 1)
	        		}
	        	}
	        	req.session.profile.bookmarks_group_posts = data.bookmarks_group_posts;
	        	data.save();
				response.setSucceededResponse(res, "Succesfully remove a bookmark from a group post!");
		    }
		});
	},

	addCourseMaterialBookmark: function(req, res){
		User.object.findById(req.session.profile._id)
			.select( 'bookmarks_course_materials')
			.exec( function(err, data){
			if(err ||  data == null ) {
				response.setFailedResponse(res, err);
	        } else {
	        	data.bookmarks_course_materials.push({
	        		notes : req.body.notes,
					course : req.body.course_id,
					weekly_materials_id : req.body.weekly_materials_id,
					material : req.body.material
	        	})
	        	req.session.profile.bookmarks_course_materials = data.bookmarks_course_materials;
	        	data.save();
				response.setSucceededResponse(res, "Succesfully bookmarking a personal post!");
		    }
		});
	},

	isInCourseMaterialBookmark: function(req, res){
		found = false;
		for (var i = req.session.profile.bookmarks_course_materials.length - 1;!found && i >= 0; i--) {
			if(req.body.material_id == req.session.profile.bookmarks_course_materials[i].material){
				bookmark_data = req.session.profile.bookmarks_course_materials[i];
				found = true;
			}
		}
		if(found)
			response.setSucceededResponse(res, {isInArray : true, bookmark_data: bookmark_data});
		else
			response.setSucceededResponse(res, {isInArray : false});
	},

	removeCourseMaterialBookmark: function(req, res){
		bookmark_id = req.body.bookmark_id;
		User.object.findById(req.session.profile._id)
			.select( 'bookmarks_course_materials')
			.exec( function(err, data){
			if(err ||  data == null ) {
				response.setFailedResponse(res, err);
	        } else {
	        	found = false;
	        	for (var i = data.bookmarks_course_materials.length - 1; !found && i >= 0; i--) {
	        		if( data.bookmarks_course_materials[i]._id == bookmark_id){
	        			found = true;
	        			data.bookmarks_course_materials.splice(i, 1)
	        		}
	        	}
	        	req.session.profile.bookmarks_course_materials = data.bookmarks_course_materials;
	        	data.save();
				response.setSucceededResponse(res, "Succesfully remove a bookmark from a group post!");
		    }
		});
	},
}

