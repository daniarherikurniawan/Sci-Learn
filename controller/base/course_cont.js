var fs = require('fs');
var im = require('imagemagick');
var rimraf = require('rimraf');
var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');
var Group = require('../../dbhelper/group_model');
var Course = require('../../dbhelper/course_model');
var Material = require('../../dbhelper/material_model');
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
    get_list_course: function(user_id, isMyCourses, res){
		if(!isMyCourses)
			match = {'course_accessibility':'Public Course'}
		else
			match = {'course_accessibility':{$in: ['Public Course', 'Private Course']}}
		console.log(user_id)
        User.object.findById(user_id)
            .select('courses')
            .populate({
					path:'courses',
					select:'course_name course_accessibility',
					match: match,
					options: {
				    	limit: 8
				    }
				})
            .exec(function(err, user_data){
            	// console.log(user_data)
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

	updateCourseOverview: function(req, res){
		course_id = req.session.course._id;
		data = req.body.data;
		Course.object.findById(course_id)
			.exec(function (err, data_course){
				// console.log(data_course)
				if(err || data_course == null){
					response.setFailedResponse(res, "Course is not found!");
				}else{
					data_course.course_overview = data;
					data_course.save();
					// response.setSucceededResponse(res, "Success update course's overview!" );
					res.redirect('/course/'+course_id);
				}
			}
		)
	},
	updateMaterialDesc: function(req, res){
		course_id = req.session.course._id;
		data = req.body.data;
		Course.object.findById(course_id)
			.exec(function (err, data_course){
				// console.log(data_course)
				if(err || data_course == null){
					response.setFailedResponse(res, "Course is not found!");
				}else{
					data_course.course_materials_description = data;
					data_course.save();
					// response.setSucceededResponse(res, "Success update course's overview!" );
					res.redirect('/course/'+course_id);
				}
			}
		)
	},
	editWeeklyMaterial: function(req, res){
		course_id = req.session.course._id;
		array_updated_material = req.body.data;
		material_id = req.body.id;
		index = -1;
		Course.object.findById(course_id)
			.select('weekly_materials')
			.exec(function (err, data_course){
				for (var i = data_course.weekly_materials.length - 1; i >= 0; i--) {
					if(data_course.weekly_materials[i]._id == material_id){
						array_materials_id = data_course.weekly_materials[i].materials;
						index = i;
					}
				}
				Material.object.find({_id: {$in: array_materials_id}})
					.exec(function (err, data_materials){
						array_deleted_materials = [];
						/*delete if not extst in the updated materials list*/
						data_course.weekly_materials[index].materials = [];

						for (var i = data_materials.length - 1; i >= 0; i--) {
							found = false;
							for (var j = array_updated_material.length - 1; j >= 0; j--) {
								// console.log(i+'  '+j+'  apa sama '+data_materials[i]._id+' dengan  '+array_updated_material[j].id)
								if(data_materials[i]._id == array_updated_material[j].id){
									data_materials[i].material_title = array_updated_material[j].material_title;
									data_materials[i].material_description = array_updated_material[j].material_description;
									data_materials[i].material_url = array_updated_material[j].material_url;
									data_materials[i].save();
									found = true;
								}
							}

							if(!found)
								array_deleted_materials.push(data_materials[i]._id)
						};
						Material.object.remove({_id:{$in: array_deleted_materials}}); 
						
						/*create new material if not exist before*/
						for (var i = array_updated_material.length - 1; i >= 0; i--) {
							if(array_updated_material[i].id == undefined){
								var MaterialObj = new Material.model(array_updated_material[i]);
								MaterialObj.save()
								array_updated_material[i].id = MaterialObj._id;
								console.log("createeeee")
							}
						}
						for (var i = 0 ; i < array_updated_material.length ; i++) {
							data_course.weekly_materials[index].materials.push(array_updated_material[i].id)
						}

						data_course.save();	
						response.setSucceededResponse(res, "Success add weekly material!" );
					})
			}
		);
	},
	addWeeklyMaterial: function(req, res){
		course_id = req.session.course._id;
		data_material = req.body;
		// response.setSucceededResponse(res, req.body );
		Course.object.findById(course_id)
			.exec(function (err, data_course){
				// console.log(data_course)
				if(err || data_course == null){
					response.setFailedResponse(res, "Course is not found!");
				}else{
					var materials_id = [];
					for (var i = 0; i < data_material.length;  i++) {
						// console.log(data_material[i])

						var MaterialObj = new Material.model(data_material[i]);
						MaterialObj.save()
						// console.log('MaterialObj._id '+MaterialObj._id)
						materials_id.push(MaterialObj._id)
					}

					while (materials_id.length != data_material.length){
						setTimeout(function() {
						  //your code to be executed after 1 second
						}, 20);
					}

					/*materials already inserted all in material table*/
					per_week_material = {
						periode_name :'Week '+(data_course.weekly_materials.length+1),
						materials : []
					}

					for (var i = 0; i < materials_id.length ; i++) {
						per_week_material.materials.push(materials_id[i]);
					}
					
					data_course.weekly_materials.push(per_week_material);
					
					data_course.save();
					response.setSucceededResponse(res, "Success add weekly material!" );
				}
			}
		)
	},
}

