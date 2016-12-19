// if(numberOfCourse == 0){
// 	document.getElementById('show-opened-courses').innerHTML = "No course available yet!"
// }

  initiateListCourse(profile_id);

  function initiateListCourse(profile_id){
    var http = new XMLHttpRequest();
    http.open("POST", "/group/getListCoursePerGroup", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "user_id=" + user_id+"&group_id=" + group_id;
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
        document.getElementById('show-opened-courses').innerHTML = group_list_name;

        if(result.length  == 8){
   			document.getElementById('show-opened-courses').innerHTML = "<a href='/group/courses/"+group_id+"'>See all courses</a>"     	
        }else{
        	if(result.length == 0){
        		// alert("cds")
   				document.getElementById('show-opened-courses').innerHTML = "There is no available course yet!"  
        	}
        }
      }
    }
  }