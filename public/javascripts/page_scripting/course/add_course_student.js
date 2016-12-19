
$('input#search-course-student').on('focus', function(e) {
  setTimeout(function() {
    $('div#search-course-instructor').removeClass('dropdown open');
  $('input#search-course-instructor').val('');
  }, 0);
});


var search_result_student = [];
var html_search_result_student =""
function updateListSearchAddStudent(){
  html_search_result_student = "";
  for (var i = search_result_student.length - 1; i >= 0; i--) {
    if(isIdInArray(search_result_student[i]._id, list_student_candidate)){
      search_result_student.splice(i, 1);
    }
  }
  for ( i = 0;i <= search_result_student.length - 1; i++) {
    if(search_result_student[i]._id != profile_id){
      html_search_result_student += "<li><button class=\"btn btn-primary pull-left\" onclick=\"addStudentToTheList('"+
        search_result_student[i]._id+"','"+search_result_student[i].email+
        "','"+search_result_student[i].img_profile_name+"','"+
        search_result_student[i].name+"')\" style=\"margin: 3px\"><small><span class=\"glyphicon glyphicon-plus\"></span></small>&nbsp;&nbsp;&nbsp;&nbsp;"+search_result_student[i].name+"</button></li>"
    }
  }
    // alert("ckdsc")
  document.getElementById('search-course-student-result').innerHTML =html_search_result_student;
  if(search_result_student.length == 0 || 
    (search_result_student.length == 1 && search_result_student[0]._id == profile_id))
    $('div#search-course-student').removeClass('dropdown open');
}

$('input#search-course-student').on('keyup', function(e) {
    search_term = $('input#search-course-student').val();
    
      var http = new XMLHttpRequest();
      http.open("POST", "/group/quickSearchWithinGroupMember", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "search_term=" + search_term+"&group_id=" + group_id;
      http.send((params));
      http.onload = function() {
        search_result_student = JSON.parse(http.responseText);
        if(search_result_student.length == 0){
          $('div#search-course-student').removeClass('dropdown open');
        }else{
          $('div#search-course-student').addClass('dropdown open');
          updateListSearchAddStudent()
        }
      }
    
  });

var list_student_candidate=[];

updateListProfPicStudent();

function isIdInArray(id, array){
  for (var i = array.length - 1; i >= 0; i--) {
    if(array[i]._id == id)
      return true
  }list_student_candidate
  return false;
}

function addStudentToTheList(_id, email, img_profile_name, name){
  list_student_candidate.pushIfNotExist({
    '_id' : _id,
    'name': name,
    'email': email,
    'img_profile_name': img_profile_name
    },function(e) {  
    return e.name === name && e.email === email; 
  });
  
  /*if exist in instructor array*/
  for (var i = list_instructor_candidate.length - 1; i >= 0; i--) {
    if(list_instructor_candidate[i]._id == _id){
      list_instructor_candidate.splice(i, 1)
      updateListProfPicInstructor();
    }
  }

  updateListProfPicStudent();
  updateListSearchAddStudent();
}

function removeStudentFromList(index){
  list_student_candidate.splice(index, 1);
  updateListProfPicStudent();
  updateListSearchAddStudent();
}

function updateListProfPicStudent(){
  var list_profpic = '';
  for (var i = list_student_candidate.length - 1; i >= 0; i--) {
      list_profpic += "<div style=\" display:inline-block;     margin: 0px 6px 6px 0px;\">"+
      " <img style=\"width:45px; margin:1px \" title=\""+
      list_student_candidate[i].name+"\" src=\"/images/"+list_student_candidate[i].email+"/profile/"+
      list_student_candidate[i].img_profile_name+"\"> <a id=\"close\" onclick=\"removeStudentFromList("+i+")\" style=\"position: relative;\"></a></div>";
  }
  document.getElementById('student_list').innerHTML = list_profpic;

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

function clearSearchTermStudent(){
  $('input#search-course-student').val('');
  $('div#search-course-student').removeClass('dropdown open');
  $('input#search-course-student').focus();
}