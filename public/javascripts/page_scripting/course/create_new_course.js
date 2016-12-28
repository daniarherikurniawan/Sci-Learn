/*Initialization*/
$('#create_course_modal').on('shown.bs.modal', function () {
  $('textarea#course_name').focus();
}) 


function createNewCourse(){
	course_name = $('textarea#course_name').val();
	course_info = $('textarea#course_info').val();
	course_admin = profile_id;
	course_accessibility = $('select#course-accessibility').val();
	course_students = new Array();
	for (var i = list_student_candidate.length - 1; i >= 0; i--) {
		course_students.push(new Object(list_student_candidate[i]._id));
	}

  course_instructors = new Array();
  for (var i = list_instructor_candidate.length - 1; i >= 0; i--) {
    course_instructors.push(new Object(list_instructor_candidate[i]._id));
  }

  if(course_name =='' || course_info =='' || course_students.length == 1 || course_instructors.length == 1){
        alert("Failed create course. Please fill all input columns!")
  }else{
    var http = new XMLHttpRequest();
    http.open("POST", "/course/createNewCourse", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "course_name=" + window.encodeURIComponent(course_name)+"&group_id=" + window.encodeURIComponent(group_id)+
    "&course_info=" + window.encodeURIComponent(course_info)+"&course_students="+window.encodeURIComponent(course_students)+
    "&course_instructors="+window.encodeURIComponent(course_instructors)+"&course_accessibility="+window.encodeURIComponent(course_accessibility);
    // alert(params)
    http.send(params);
    http.onload = function() {
      var result = JSON.parse(http.responseText);
    	$('input#close-modal-create-new-course').click();
      if(result.status == 1){
        	window.location.href= "/course/"+result.message.course_id;
    	}else{
    		alert("failed create course")
    	}
    }
  }
}