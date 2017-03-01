// if(numberOfCourse == 0){
// 	document.getElementById('show-opened-courses').innerHTML = "No course available yet!"
// }

  if(!isGroupAdmin){
    $('#open-new-course').remove();
    $('#opened_courses_title').attr('style', 'text-align: center')
  }


  initiateListCourse(current_profile_id);

  function initiateListCourse(profile_id){
    var http = new XMLHttpRequest();
    http.open("POST", "/group/getListCoursePerGroup", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "user_id=" + window.encodeURIComponent(profile_id)+"&group_id=" + window.encodeURIComponent(group_id);
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
            if(result[i].course_name.length >= 25){
               course_list_name += result[i].course_name.substring(0, 24)+"...";
              // document.write("cdsc")
            }else{
                course_list_name += result[i].course_name;
            }
            course_list_name+="</a> ";
          }
        }

        if(result.length  == 8){
        document.getElementById('show-opened-courses').innerHTML = "<a href='/courses/"+profile_id+"'>See all courses</a>"       
        }else{
          $('#show-opened-courses').attr('style', '')
          
          if(result.length == 0){
            document.getElementById('show-opened-courses').innerHTML = "There is no available course yet!"  
          }
        }

        document.getElementById('opened_courses_list').innerHTML = course_list_name;
      }
    }
  }

