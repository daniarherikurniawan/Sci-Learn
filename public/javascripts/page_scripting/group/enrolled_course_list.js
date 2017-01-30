isMyOwnCourse = profile_id == current_profile_id;

  if(!isMyOwnCourse){
    /*not my profile page*/
    document.getElementById('list-course-title').innerHTML ="<i class=\"glyphicon glyphicon-blackboard\" style=\"top: 2px\"></i> &nbsp; "+
      current_profile_name+"'s Courses";
    document.getElementById('search-new-course').innerHTML = "";
  $('#list-course-title').attr('style', 'text-align: center'); 
  }


  initiateListCourse(current_profile_id);

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
        course_list_name = ''
        for (var i = 0; i <= result.length - 1 && i < 8; i++) {
          if(i < 7){
            if(result[i].course_accessibility == "Private Course"){
               icon = "<i style='color: #2d6363; margin-right:3px; font-size: 17px;' title='Private Course' class=\"fa fa-lock\"></i>";
        }else{
          icon = "<i style='color: #2d6363; margin-right:3px' title='Public Course' class=\"fa fa-globe\"></i>";
        }
            course_list_name += "<a href=\"/course/"+result[i]._id+"\" class=\"list-group-item\">"+icon+"   ";
            
            if(result[i].course_name.length >= 20){
               course_list_name += result[i].course_name.substring(0, 19)+"...";
              // document.write("cdsc")
            }else{
                course_list_name += result[i].course_name;
            }

            course_list_name +="</a> ";
          }
        }
        // alert()
        if(result.length  == 8){
   			document.getElementById('show-all-courses').innerHTML = "<a href='/courses/"+profile_id+"'>See all courses</a>"     	
        }else{
        	$('#show-all-courses').attr('style', '')
        	
        	if(result.length == 0){

            if (isMyOwnCourse)
              document.getElementById('show-all-courses').innerHTML = "You haven't enrolled to any course!"  
            else
              document.getElementById('show-all-courses').innerHTML = "There is no public course to display!"  
        	}
        }
        document.getElementById('enrolled_courses_list').innerHTML = course_list_name;

      }
    }
  }
