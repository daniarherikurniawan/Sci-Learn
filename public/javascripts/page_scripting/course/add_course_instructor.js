
$('input#search-course-instructor').on('focus', function(e) {
  setTimeout(function() {
    $('div#search-course-student').removeClass('dropdown open');
  $('input#search-course-student').val('');
  }, 0);
});


var search_result_instructor = [];
var html_search_result_instructor =""
function updateListSearchAddInstructor(){
  html_search_result_instructor = "";
  for (var i = search_result_instructor.length - 1; i >= 0; i--) {
    if(isIdInArray(search_result_instructor[i]._id, list_instructor_candidate)){
      search_result_instructor.splice(i, 1);
    }
  }
  for ( i = 0;i <= search_result_instructor.length - 1; i++) {
      html_search_result_instructor += "<li><button class=\"btn btn-primary pull-left\" onclick=\"addInstructorToTheList('"+
        search_result_instructor[i]._id+"','"+search_result_instructor[i].email+
        "','"+search_result_instructor[i].img_profile_name+"','"+
        search_result_instructor[i].name+"')\" style=\"margin: 3px\"><small><span class=\"glyphicon glyphicon-plus\"></span></small>&nbsp;&nbsp;&nbsp;&nbsp;"+search_result_instructor[i].name+"</button></li>"
    }
  document.getElementById('search-course-instructor-result').innerHTML =html_search_result_instructor;
  if(search_result_instructor.length == 0)
    $('div#search-course-instructor').removeClass('dropdown open');
}

$('input#search-course-instructor').on('keyup', function(e) {
    search_term = $('input#search-course-instructor').val();
    
      var http = new XMLHttpRequest();
      http.open("POST", "/group/quickSearchWithinGroupMember", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "search_term=" + search_term+"&group_id=" + group_id;
      http.send((params));
      http.onload = function() {
        search_result_instructor = JSON.parse(http.responseText);
        if(search_result_instructor.length == 0){
          $('div#search-course-instructor').removeClass('dropdown open');
        }else{
          $('div#search-course-instructor').addClass('dropdown open');
          updateListSearchAddInstructor()
        }
      }
    
  });

var list_instructor_candidate=[];

//initialization 
list_instructor_candidate.push({
  '_id' : profile_id,
  'name': profile_name,
  'email': profile_email,
  'img_profile_name': profile_img_profile_name
  });
updateListProfPicInstructor();

function isIdInArray(id, array){
  for (var i = array.length - 1; i >= 0; i--) {
    if(array[i]._id == id)
      return true
  }
  return false;
}

function addInstructorToTheList(_id, email, img_profile_name, name){
  list_instructor_candidate.pushIfNotExist({
    '_id' : _id,
    'name': name,
    'email': email,
    'img_profile_name': img_profile_name
    },function(e) {  
    return e.name === name && e.email === email; 
  });

   /*if exist in instructor array*/
  for (var i = list_student_candidate.length - 1; i >= 0; i--) {
    if(list_student_candidate[i]._id == _id){
      list_student_candidate.splice(i, 1)
      updateListProfPicStudent();
    }
  }


  updateListProfPicInstructor();
  updateListSearchAddInstructor();
}

function removeInstructorFromList(index){
  list_instructor_candidate.splice(index, 1);
  updateListProfPicInstructor();
  updateListSearchAddInstructor();
}

function updateListProfPicInstructor(){
  var list_profpic = '';
  for (var i = list_instructor_candidate.length - 1; i >= 0; i--) {
    if(i == 0){
      //admin without remove button
      list_profpic += "<div style=\" display:inline-block;     margin: 0px 6px 6px 0px;\">"+
      " <img style=\"width:45px; margin:1px \" title=\""+
      list_instructor_candidate[i].name+" (group admin)\" src=\"/images/"+list_instructor_candidate[i].email+"/profile/"+
      list_instructor_candidate[i].img_profile_name+"\"> </div>";
    }else{
      list_profpic += "<div style=\" display:inline-block;     margin: 0px 6px 6px 0px;\">"+
      " <img style=\"width:45px; margin:1px \" title=\""+
      list_instructor_candidate[i].name+"\" src=\"/images/"+list_instructor_candidate[i].email+"/profile/"+
      list_instructor_candidate[i].img_profile_name+"\"> <a id=\"close\" onclick=\"removeInstructorFromList("+i+")\" style=\"position: relative;\"></a></div>";
    }
  }
  document.getElementById('instructor_list').innerHTML = list_profpic;

}


// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) { 
    for(var i=0; i < this.length; i++) { 
        if(comparer(this[i])) return true; 
    }
    return false; 
}; 

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) { 
    if (!this.inArray(comparer)) {
        this.push(element);
    }
}; 

function clearSearchTermInstructor(){
  $('input#search-course-instructor').val('');
  $('div#search-course-instructor').removeClass('dropdown open');
  $('input#search-course-instructor').focus();
}