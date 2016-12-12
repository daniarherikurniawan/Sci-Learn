var fs = require('fs');
var im = require('imagemagick');
var rimraf = require('rimraf');
var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');
var Group = require('../../dbhelper/group_model');
var Course = require('../../dbhelper/course_model');
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
    get_list_course: function(user_id, res){
					console.log(user_id)
        User.object.findById(user_id)
            .select('courses')
            .populate({
					path:'courses',
					select:'course_name',
					options: {
				    	limit: 8
				    }
				})
            .exec(function(err, user_data){
				if (err) {
					response.setFailedResponse(res, "failed");
				} else {
					if (user_data.groups == undefined)
						response.setSucceededResponse(res, []);
					else						
						response.setSucceededResponse(res, user_data.groups);
				}
                return ;
            })
    }
}

