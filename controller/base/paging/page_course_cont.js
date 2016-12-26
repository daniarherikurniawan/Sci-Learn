
var Group = require('../../../dbhelper/group_model');
var Course = require('../../../dbhelper/course_model');
var Post = require('../../../dbhelper/post_model');
var User = require('../../../dbhelper/user_model');

// var post_func = require('../../../controller/common/post_func');
// var page_home_func = require('../../../controller/common/paging/page_home_func');

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function isInstructor(user_id, course_instructors){
	for (var i = course_instructors.length - 1; i >= 0; i--) {
		if( course_instructors[i]._id == user_id)
			return true;
	}
	return false;
}


module.exports = { 
	showCoursePage: function(course_id, req, res, numOfCurrPage, limit){
		if(!isInArray(course_id, req.session.profile.courses)){
			res.redirect('/');
		}else{
			Course.object.findById(course_id)
				.populate('weekly_materials.materials')
				.exec( function(err, course_data){
					if(err || course_data == null){
						console.log(err);
						res.send("404");
					}else{
						previous_opened_week = null;
						if (req.session.specific_week_id != null){
							previous_opened_week = req.session.specific_week_id ;
							req.session.specific_week_id = null;
						}
						req.session.course = course_data;
						res.render('course', {course: req.session.course, 
							isMaterialsExist: (course_data.weekly_materials.length > 0),
							profile: req.session.profile, 
							isInstructor: isInstructor(req.session.profile._id, req.session.course.course_instructors),
							showCourseHome : true,
							showCourseGrades : false,
							showCourseDiscussionForum : false,
							showCourseParticipants : false,
							showCourseMaterial: false,
							setting: req.session.setting,
							 previous_opened_week: previous_opened_week,
						partials: { 
							courseHome:'partial/course/courseHome', courseGrades:'partial/course/courseGrades',
							courseParticipants:'partial/course/courseParticipants',
							edit_single_column_template: 'template/edit_single_column_template',
							topNavigationCourse:'partial/course/topNavigationCourse', leftNavigationCourse:'partial/course/leftNavigationCourse',
							mainViewCourse:'partial/course/mainViewCourse', courseMaterial:'partial/course/courseMaterial', 
							courseDiscussionForum:'partial/course/courseDiscussionForum'}});

					}
					
				});
			}
		},

		
		showGroupMembersResultSearchPage: function(group_id,  search_term, req, res, numOfCurrPage, limit){
		if(!isInArray(group_id, req.session.profile.groups)){
			res.redirect('/');
		}else{
			Group.object.findById(group_id)
				.populate({
					  	path: 'group_members',
						match: {'name': new RegExp(search_term, "i")},
					  	select: 'name email img_profile_name'
					}
				)
				.exec( function(err, group_data){
					if(err || group_data == null){
						console.log(err);
						res.send("404");
					}else{
						isGroupAdmin = (group_data.group_admin.indexOf(req.session.profile._id) != -1)
						
						console.log('isGroupAdmin '+isGroupAdmin)
						res.render('group', {group: group_data, showSearchMemberResult:true,
							profile: req.session.profile, isGroupAdmin: isGroupAdmin,
							numOfPost : 0, numOfLastPage : 0, search_term_for_group_member: search_term,
							numOfCurrPage : 0, limitPerPage : limit, setting: req.session.setting,
						partials: {group_info:'partial/group_info', share_modal: 'modal/share_modal', group_member:'partial/group_member',
							edit_post_template: 'template/edit_post_template', create_group_modal: 'modal/create_group_modal',
							per_group_member_detail: 'partial/per_group_member_detail',
							add_group_admin_modal: 'modal/add_group_admin_modal',
							remove_group_admin_modal: 'modal/remove_group_admin_modal',
							add_group_member_modal: 'modal/add_group_member_modal',
							remove_group_member_modal: 'modal/remove_group_member_modal',
							create_course_modal: 'modal/create_course_modal', group_member_detail: 'partial/group_member_detail',
							post_partial: 'partial/post_partial', list_group:'partial/list_group', list_course_in_group: 'partial/list_course_in_group',
							topNavigation:'partial/topNavigation'}});
					}
				});
			}
		},


		showWeeklyMaterials: function(req, res){
			course_id = req.session.course._id;
			if(!isInArray(course_id, req.session.profile.courses)){
				res.redirect('/');
			}else{
				course = req.session.course;
				week_id = req.params.week_id;
				found = false;
				for (var i = course.weekly_materials.length - 1; !found && i >= 0; i--) {
					if( course.weekly_materials[i]._id == week_id){
						found = true;
						current_weekly_material = course.weekly_materials[i]
					}
				}
				if(!found){
					response.setFailedResponse(res, "Weekly course materials are not found!");
				}else{
					res.redirect('/course/week/'+week_id+'/'+current_weekly_material.materials[0]._id);	
				}
			}
		},
		
		showSpecificMaterial: function(req, res){
			course_id = req.session.course._id;
			if(!isInArray(course_id, req.session.profile.courses)){
				res.redirect('/');
			}else{
				course = req.session.course;
				week_id = req.params.week_id;
				material_id = req.params.material_id;
				found = false;
				for (var i = course.weekly_materials.length - 1; !found && i >= 0; i--) {
					if( course.weekly_materials[i]._id == week_id){
						found = true;
						current_weekly_material = course.weekly_materials[i]
						req.session.specific_week_id = current_weekly_material._id;
						material_exist = false;
						for (var j = current_weekly_material.materials.length - 1; j >= 0; j--) {
							if( current_weekly_material.materials[j]._id == material_id){
								current_weekly_material.materials[j].active = true;
								single_material = current_weekly_material.materials[j];
								material_exist = true;
							}else{
								current_weekly_material.materials[j].active = false;
							}
						}
					}
				}

				if(!found || !material_exist){
					response.setFailedResponse(res, "Weekly course materials are not found!");
				}else{
					res.render('course', {course: course, current_weekly_material: current_weekly_material,
						isMaterialsExist: found, single_material: single_material,
						profile: req.session.profile, 
						isInstructor: isInstructor(req.session.profile._id, req.session.course.course_instructors),
						showCourseMaterial: true,
						setting: req.session.setting,
					partials: { 
						courseHome:'partial/course/courseHome', courseGrades:'partial/course/courseGrades',
						courseParticipants:'partial/course/courseParticipants',
						edit_single_column_template: 'template/edit_single_column_template',
						topNavigationCourse:'partial/course/topNavigationCourse', leftNavigationCourse:'partial/course/leftNavigationCourse',
						mainViewCourse:'partial/course/mainViewCourse', courseMaterial:'partial/course/courseMaterial', 
						courseDiscussionForum:'partial/course/courseDiscussionForum'}});
				}
			}	
		},

		showCourseParticipants: function(req, res){
			course_id = req.session.course._id;
			/*The course should be public*/
			if(!isInArray(course_id, req.session.profile.courses)){
				res.redirect('/');
			}else{
				Course.object.findById(course_id)
					.populate('course_students course_instructors')
					.exec( function(err, course_data){
						if(err || course_data == null){
							console.log(err);
							res.send("404");
						}else{
							req.session.course = course_data;
							res.render('course', {course: req.session.course,
								profile: req.session.profile, 
								showCourseParticipants : true,
								isInstructor: isInstructor(req.session.profile._id, req.session.course.course_instructors),
								setting: req.session.setting,
							partials: { 
								courseHome:'partial/course/courseHome', courseGrades:'partial/course/courseGrades',
								courseParticipants:'partial/course/courseParticipants',
								per_course_participants_detail: 'partial/course/per_course_participants_detail',
								add_course_instructor_modal: 'modal/course/add_course_instructor_modal',
								remove_course_instructor_modal: 'modal/course/remove_course_instructor_modal',
								add_course_student_modal: 'modal/course/add_course_student_modal',
								remove_course_student_modal: 'modal/course/remove_course_student_modal',
								edit_single_column_template: 'template/edit_single_column_template',
								topNavigationCourse:'partial/course/topNavigationCourse', leftNavigationCourse:'partial/course/leftNavigationCourse',
								mainViewCourse:'partial/course/mainViewCourse', courseMaterial:'partial/course/courseMaterial', 
								courseDiscussionForum:'partial/course/courseDiscussionForum'}});

						}
						
					});
				}
		},

		showGroupMembersPage: function(group_id, req, res, numOfCurrPage, limit){
		if(!isInArray(group_id, req.session.profile.groups)){
			res.redirect('/');
		}else{
			Group.object.findById(group_id)
				.populate({
					  path: 'group_members',
					  select: 'name email img_profile_name'
					}
				)
				.populate({
					  path: 'group_admin',
					  select: 'name email img_profile_name'
					}
				)
				.exec( function(err, group_data){
					if(err || group_data == null){
						console.log(err);
						res.send("404");
					}else{
						isGroupAdmin = false;
						for (var i = group_data.group_admin.length - 1; i >= 0; i--) {
							if(group_data.group_admin[i]._id == req.session.profile._id)
								isGroupAdmin = true;
						}
						// console.log('isGroupAdmin '+isGroupAdmin)
						res.render('group', {group: group_data, showGroupMemberDetail:true,
							profile: req.session.profile, isGroupAdmin: isGroupAdmin,
							numOfPost : 0, numOfLastPage : 0,
							numOfCurrPage : 0, limitPerPage : limit, setting: req.session.setting,
						partials: {group_info:'partial/group_info', share_modal: 'modal/share_modal', group_member:'partial/group_member',
							edit_post_template: 'template/edit_post_template', create_group_modal: 'modal/create_group_modal',
							per_group_member_detail: 'partial/per_group_member_detail',
							add_group_admin_modal: 'modal/add_group_admin_modal',
							remove_group_admin_modal: 'modal/remove_group_admin_modal',
							add_group_member_modal: 'modal/add_group_member_modal',
							remove_group_member_modal: 'modal/remove_group_member_modal',
							create_course_modal: 'modal/create_course_modal', group_member_detail: 'partial/group_member_detail',
							post_partial: 'partial/post_partial', list_group:'partial/list_group', list_course_in_group: 'partial/list_course_in_group',
							topNavigation:'partial/topNavigation'}});
					}
				});
			}
		},

	
}



