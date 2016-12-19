  initiateListCourse(profile_id);

  function initiateListCourse(profile_id){
    var http = new XMLHttpRequest();
    http.open("POST", "/course/getList", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "user_id=" + window.encodeURIComponent(profile_id);
    http.send((params));
    http.onload = function() {
      result = JSON.parse(http.responseText);
      if(http.responseText=="404" || result.status == 0){
        alert(http.responseText);
      }else {
        result = result.message;
        group_list_name = ''
        for (var i = result.length - 1; i >= 0; i--) {
        	if(i < 7)
	        	group_list_name += "<a href=\"/course/"+result[i]._id+"\" class=\"list-group-item\">"+result[i].course_name+"</a> ";
        }
        // alert()
        if(result.length  == 8){
   			document.getElementById('show-all-courses').innerHTML = "<a href='/courses/"+profile_id+"'>See all courses</a>"     	
        }else{
        	$('#show-all-courses').attr('style', '')
        	
        	if(result.length == 0){
   				document.getElementById('show-all-courses').innerHTML = "You haven't enrolled to any course!"  
        	}
        }
        document.getElementById('enrolled_courses_list').innerHTML = group_list_name;

      }
    }
  }
