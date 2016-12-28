/*Initialization*/
$('#add_group_member_modal').on('shown.bs.modal', function () {
  $('input#search-new-member-group-by-admin').focus();
}) 

var search_result_add_member_modal = [];
var html_search_result_add_member_modal =""
function updateListSearchResultAddModal(){
  html_search_result_add_member_modal = "";
  for (var i = search_result_add_member_modal.length - 1; i >= 0; i--) {
    if(isIdInArray(search_result_add_member_modal[i]._id, list_new_member_modal_add_member)){
      search_result_add_member_modal.splice(i, 1);
    }
  }
  for ( i = 0;i <= search_result_add_member_modal.length - 1; i++) {
      html_search_result_add_member_modal += "<li><button class=\"btn btn-primary pull-left\" onclick=\"addMemberToTheListModalAddMember('"+
        search_result_add_member_modal[i]._id+"','"+search_result_add_member_modal[i].email+
        "','"+search_result_add_member_modal[i].name+"')\" style=\"margin: 3px\"><small><span class=\"glyphicon glyphicon-plus\"></span></small>&nbsp;&nbsp;&nbsp;&nbsp;"+search_result_add_member_modal[i].name+"</button></li>"
    }
  document.getElementById('search-new-member-group-by-admin-result').innerHTML =html_search_result_add_member_modal;
  if(search_result_add_member_modal.length == 0)
    $('div#search-new-member-group-by-admin').removeClass('dropdown open');
}

$('input#search-new-member-group-by-admin').on('keyup', function(e) {
    search_term = $('input#search-new-member-group-by-admin').val();
    var http = new XMLHttpRequest();
    http.open("POST", "/course/quickSearchWithinGroupMemberNotParticipants", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "search_term=" + window.encodeURIComponent(search_term)+"&group_id=" + window.encodeURIComponent(group_id);
    http.send((params));
    http.onload = function() {
      search_result_add_member_modal = JSON.parse(http.responseText);
      if(search_result_add_member_modal.length == 0){
        $('div#search-new-member-group-by-admin').removeClass('dropdown open');
      }else{
        $('div#search-new-member-group-by-admin').addClass('dropdown open');
        updateListSearchResultAddModal()
      }
    }
    
  });

var list_new_member_modal_add_member=[];

function isIdInArray(id, array){
  for (var i = array.length - 1; i >= 0; i--) {
    if(array[i]._id == id)
      return true
  }
  return false;
}

function addMemberToTheListModalAddMember(_id, email, name){
  list_new_member_modal_add_member.pushIfNotExist({
    '_id' : _id,
    'name': name,
    'email': email
    },function(e) {  
    return e.name === name && e.email === email; 
  });
  updateListUserToBeAdded();
  updateListSearchResultAddModal();
}

function removeMemberFromListModalAddMember(index){
  list_new_member_modal_add_member.splice(index, 1);
  updateListUserToBeAdded();
  updateListSearchResultAddModal();
}

function updateListUserToBeAdded(){
  var list_users = '';
  for (var i = 0; i <= list_new_member_modal_add_member.length - 1;  i++) {
      list_users += "<div class=\"btn\" style=\"padding: 0px; margin: 5px\">"+
                      "<button style=\"  border-top-right-radius: 0em;   border-bottom-right-radius: 0em;\""+
                      "class=\"btn btn-primary pull-left\"  onclick=\"openProfileInNewTab('/profile/"+list_new_member_modal_add_member[i].email+"')\">"+
                      list_new_member_modal_add_member[i].name+"</button>"+
                      "<button style=\"border-top-left-radius: 0em;   border-bottom-left-radius: 0em;\""+
                      "class=\"btn btn-danger pull-left\"  onclick=\"removeMemberFromListModalAddMember("+i+")\">X</button></div>";

  }
  document.getElementById('list_new_member_to_be_added').innerHTML = list_users;
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

function clearSearchTermAddModal(){
  $('input#search-new-member-group-by-admin').val('');
  $('div#search-new-member-group-by-admin').removeClass('dropdown open');
  $('input#search-new-member-group-by-admin').focus();
}

// alert(group_id+ " "+user_id)

function addGroupMember(){
  members_id = new Array();
  for (var i = list_new_member_modal_add_member.length - 1; i >= 0; i--) {
    members_id.push(new Object(list_new_member_modal_add_member[i]._id));
  }
  var http = new XMLHttpRequest();
  http.open("POST", "/course/membership/addStudent", true);
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
      alert("failed add group member")
    }
  }
}