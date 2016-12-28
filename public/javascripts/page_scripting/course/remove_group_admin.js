/*Initialization*/
$('#remove_group_admin_modal').on('shown.bs.modal', function () {
  $('input#search-admin-to-be-removed').focus();
}) 

var search_result_remove_group_admin_modal = [];
var html_search_result_remove_group_admin_modal =""
function updateListSearchResultRemoveGroupAdmin(){
  html_search_result_remove_group_admin_modal = "";
  for (var i = search_result_remove_group_admin_modal.length - 1; i >= 0; i--) {
    if(isIdInArray(search_result_remove_group_admin_modal[i]._id, list_group_admin_to_be_removed)){
      search_result_remove_group_admin_modal.splice(i, 1);
    }
  }
  for ( i = 0;i <= search_result_remove_group_admin_modal.length - 1; i++) {
      html_search_result_remove_group_admin_modal += "<li><button class=\"btn btn-primary pull-left\" onclick=\"addMemberToTheListModalRemoveGroupAdmin('"+
        search_result_remove_group_admin_modal[i]._id+"','"+search_result_remove_group_admin_modal[i].email+
        "','"+search_result_remove_group_admin_modal[i].name+"')\" style=\"margin: 3px\"><small><span class=\"glyphicon glyphicon-plus\"></span></small>&nbsp;&nbsp;&nbsp;&nbsp;"+search_result_remove_group_admin_modal[i].name+"</button></li>"
    }
  document.getElementById('search-admin-to-be-removed-result').innerHTML =html_search_result_remove_group_admin_modal;
  if(search_result_remove_group_admin_modal.length == 0)
    $('div#search-admin-to-be-removed').removeClass('dropdown open');
}

$('input#search-admin-to-be-removed').on('keyup', function(e) {
    search_term = $('input#search-admin-to-be-removed').val();

    var http = new XMLHttpRequest();
    http.open("POST", "/course/quickSearchWithinCourseInstructor", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "search_term=" + window.encodeURIComponent(search_term)+"&course_id=" + window.encodeURIComponent(course_id);
    http.send((params));
    http.onload = function() {
      search_result_remove_group_admin_modal = JSON.parse(http.responseText);
      if(search_result_remove_group_admin_modal.length == 0){
        $('div#search-admin-to-be-removed').removeClass('dropdown open');
      }else{
        $('div#search-admin-to-be-removed').addClass('dropdown open');
        updateListSearchResultRemoveGroupAdmin()
      }
    }
    
  });

var list_group_admin_to_be_removed=[];

function isIdInArray(id, array){
  for (var i = array.length - 1; i >= 0; i--) {
    if(array[i]._id == id)
      return true
  }
  return false;
}

function addMemberToTheListModalRemoveGroupAdmin(_id, email, name){
  list_group_admin_to_be_removed.pushIfNotExist({
    '_id' : _id,
    'name': name,
    'email': email
    },function(e) {  
    return e.name === name && e.email === email; 
  });
  updateListUserToBeRemovedFromGroupAdmin();
  updateListSearchResultRemoveGroupAdmin();
}

function removeMemberFromListModalRemoveGroupAdmin(index){
  list_group_admin_to_be_removed.splice(index, 1);
  updateListUserToBeRemovedFromGroupAdmin();
  updateListSearchResultRemoveGroupAdmin();
}

function updateListUserToBeRemovedFromGroupAdmin(){
  var list_users = '';
  for (var i = 0; i <= list_group_admin_to_be_removed.length - 1;  i++) {
      list_users += "<div class=\"btn\" style=\"padding: 0px; margin: 5px\">"+
                      "<button style=\"  border-top-right-radius: 0em;   border-bottom-right-radius: 0em;\""+
                      "class=\"btn btn-primary pull-left\"  onclick=\"openProfileInNewTab('/profile/"+list_group_admin_to_be_removed[i].email+"')\">"+
                      list_group_admin_to_be_removed[i].name+"</button>"+
                      "<button style=\"border-top-left-radius: 0em;   border-bottom-left-radius: 0em;\""+
                      "class=\"btn btn-danger pull-left\"  onclick=\"removeMemberFromListModalRemoveGroupAdmin("+i+")\">X</button></div>";

  }
  document.getElementById('list_group_admin_to_be_removed').innerHTML = list_users;
}

function openProfileInNewTab(url){
  window.open(url, '_blank');
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

function clearSearchTermRemoveGroupAdminModal(){
  $('input#search-admin-to-be-removed').val('');
  $('div#search-admin-to-be-removed').removeClass('dropdown open');
  $('input#search-admin-to-be-removed').focus();
}

// alert(group_id+ " "+user_id)

function removeMemberFromGroupAdmin(){
  members_id = new Array();
  for (var i = list_group_admin_to_be_removed.length - 1; i >= 0; i--) {
    members_id.push(new Object(list_group_admin_to_be_removed[i]._id));
  }
  var http = new XMLHttpRequest();
  http.open("POST", "/course/membership/removeInstructor", true);
  http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var params = "course_id=" + window.encodeURIComponent(course_id)+"&user_id=" + window.encodeURIComponent(user_id)+
  "&members_id="+window.encodeURIComponent(members_id);
  // alert()
  http.send(params);
  http.onload = function() {
    var result = JSON.parse(http.responseText);
    $('input#close-modal-create-new-group').click();
    if(result.status == 1){
        window.location.href= "/course/"+result.message.course_id+"/participants";
    }else{
      alert("failed remove admin")
    }
  }
}