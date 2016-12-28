/*Initialization*/
$('#remove_group_member_modal').on('shown.bs.modal', function () {
  $('input#search-member-to-remove-by-admin').focus();
}) 

var search_result_remove_member_modal = [];
var html_search_result_remove_member_modal =""
function updateListSearchResult(){
  html_search_result_remove_member_modal = "";
  for (var i = search_result_remove_member_modal.length - 1; i >= 0; i--) {
    if(isIdInArray(search_result_remove_member_modal[i]._id, list_member_group_to_be_removed)){
      search_result_remove_member_modal.splice(i, 1);
    }
  }
  for ( i = 0;i <= search_result_remove_member_modal.length - 1; i++) {
      html_search_result_remove_member_modal += "<li><button class=\"btn btn-primary pull-left\" onclick=\"addMemberToTheListModalRemoveMember('"+
        search_result_remove_member_modal[i]._id+"','"+search_result_remove_member_modal[i].email+
        "','"+search_result_remove_member_modal[i].name+"')\" style=\"margin: 3px\"><small><span class=\"glyphicon glyphicon-plus\"></span></small>&nbsp;&nbsp;&nbsp;&nbsp;"+search_result_remove_member_modal[i].name+"</button></li>"
    }
  document.getElementById('search-member-to-remove-by-admin-result').innerHTML =html_search_result_remove_member_modal;
  if(search_result_remove_member_modal.length == 0)
    $('div#search-member-to-remove-by-admin').removeClass('dropdown open');
}

$('input#search-member-to-remove-by-admin').on('keyup', function(e) {
    search_term = $('input#search-member-to-remove-by-admin').val();

    var http = new XMLHttpRequest();
    http.open("POST", "/course/quickSearchWithinCourseStudents", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "search_term=" + window.encodeURIComponent(search_term)+"&course_id=" + window.encodeURIComponent(course_id);
    http.send((params));
    http.onload = function() {
      search_result_remove_member_modal = JSON.parse(http.responseText);
      if(search_result_remove_member_modal.length == 0){
        $('div#search-member-to-remove-by-admin').removeClass('dropdown open');
      }else{
        $('div#search-member-to-remove-by-admin').addClass('dropdown open');
        updateListSearchResult()
      }
    }
    
  });

var list_member_group_to_be_removed=[];

function isIdInArray(id, array){
  for (var i = array.length - 1; i >= 0; i--) {
    if(array[i]._id == id)
      return true
  }
  return false;
}

function addMemberToTheListModalRemoveMember(_id, email, name){
  list_member_group_to_be_removed.pushIfNotExist({
    '_id' : _id,
    'name': name,
    'email': email
    },function(e) {  
    return e.name === name && e.email === email; 
  });
  updateListUserToBeRemoved();
  updateListSearchResult();
}

function removeMemberFromListModalRemoveMember(index){
  list_member_group_to_be_removed.splice(index, 1);
  updateListUserToBeRemoved();
  updateListSearchResult();
}

function updateListUserToBeRemoved(){
  var list_users = '';
  for (var i = 0; i <= list_member_group_to_be_removed.length - 1;  i++) {
      list_users += "<div class=\"btn\" style=\"padding: 0px; margin: 5px\">"+
                      "<button style=\"  border-top-right-radius: 0em;   border-bottom-right-radius: 0em;\""+
                      "class=\"btn btn-primary pull-left\"  onclick=\"openProfileInNewTab('/profile/"+list_member_group_to_be_removed[i].email+"')\">"+
                      list_member_group_to_be_removed[i].name+"</button>"+
                      "<button style=\"border-top-left-radius: 0em;   border-bottom-left-radius: 0em;\""+
                      "class=\"btn btn-danger pull-left\"  onclick=\"removeMemberFromListModalRemoveMember("+i+")\">X</button></div>";

  }
  document.getElementById('list_member_group_to_be_removed').innerHTML = list_users;
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

function clearSearchTermRemoveModal(){
  $('input#search-member-to-remove-by-admin').val('');
  $('div#search-member-to-remove-by-admin').removeClass('dropdown open');
  $('input#search-member-to-remove-by-admin').focus();
}

// alert(group_id+ " "+user_id)

function removeGroupMember(){
  members_id = new Array();
  for (var i = list_member_group_to_be_removed.length - 1; i >= 0; i--) {
    members_id.push(new Object(list_member_group_to_be_removed[i]._id));
  }
  var http = new XMLHttpRequest();
  http.open("POST", "/course/membership/removeStudent", true);
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
      alert("failed remove group member")
    }
  }
}