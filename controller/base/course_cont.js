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
            	console.log(user_data)
				if (err) {
					response.setFailedResponse(res, "failed");
				} else {
					if (user_data == null || user_data.courses == undefined)
						response.setSucceededResponse(res, []);
					else						
						response.setSucceededResponse(res, user_data.courses);
				}
                return ;
            })
    },


	createCourse: function(req, res){
		course_students  = req.body.course_students.split(",");
		course_instructors  = req.body.course_instructors.split(",");
		course_members  = course_students.concat(course_instructors);
		group_id = req.body.group_id;
		req.body.course_students = course_students;
		req.body.course_instructors = course_instructors;
		// console.log(course_members)
		var CourseObj = new Course.model(req.body);
	    CourseObj.save(function(err){
			if (err) {
				response.setFailedResponse(res, err);
			} else {
				var course_folder =  "./public/groups/"+group_id+"/courses/"
	        	if (!fs.existsSync(course_folder)){
	        		fs.mkdirSync(course_folder);
	        	}

	        	var path =  course_folder+CourseObj._id+"/"
	        	if (!fs.existsSync(path)){
	        		fs.mkdirSync(path);
	        	}

	        	var pathCourseProfile = path+ "about/"
	        	if (!fs.existsSync(pathCourseProfile)){
	        		fs.mkdirSync(pathCourseProfile);
	        	}

	        	randomIdImage  = getRandomInt(1, 12);

	        	pathCourseProfile += "course_cover.jpg"
	        	fs.readFile("./public/template_cover_course/"+randomIdImage+"_course_cover.jpg", function(err, foto){
	        		fs.writeFile(pathCourseProfile, foto, function(error){
	        		});  
	        	});
				Group.object.findById(group_id)
					.select('courses_id')
					.exec(function (err, data_group){
						if(err || data_group == null){
							response.setFailedResponse(res, "group is not found!");
						}else{
							data_group.courses_id.push(CourseObj._id)
							data_group.save()

							User.object.find({_id : {$in : course_members }})
								.select('courses')
								.exec(function (err,course_members){
									for (var i = course_members.length - 1; i >= 0; i--) {
										course_members[i].courses.push(CourseObj._id);
										course_members[i].save();
									}
									req.session.profile.courses.push(CourseObj._id);
									response.setSucceededResponse(res, {'course_id':CourseObj._id});
								});
						}
					});
			}
		});
	},
}

