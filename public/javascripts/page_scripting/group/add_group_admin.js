/*Initialization*/
$('#add_group_admin_modal').on('shown.bs.modal', function () {
  $('input#search-member-to-be-admin').focus();
}) 

var search_result_add_group_admin_modal = [];
var html_search_result_add_group_admin_modal =""
function updateListSearchResultAddGroupAdmin(){
  html_search_result_add_group_admin_modal = "";
  for (var i = search_result_add_group_admin_modal.length - 1; i >= 0; i--) {
    if(isIdInArray(search_result_add_group_admin_modal[i]._id, list_member_group_to_be_choose_as_admin)){
      search_result_add_group_admin_modal.splice(i, 1);
    }
  }
  for ( i = 0;i <= search_result_add_group_admin_modal.length - 1; i++) {
      html_search_result_add_group_admin_modal += "<li><button class=\"btn btn-primary pull-left\" onclick=\"addMemberToTheListModalAddGroupAdmin('"+
        search_result_add_group_admin_modal[i]._id+"','"+search_result_add_group_admin_modal[i].email+
        "','"+search_result_add_group_admin_modal[i].name+"')\" style=\"margin: 3px\"><small><span class=\"glyphicon glyphicon-plus\"></span></small>&nbsp;&nbsp;&nbsp;&nbsp;"+search_result_add_group_admin_modal[i].name+"</button></li>"
    }
  document.getElementById('search-member-to-be-admin-result').innerHTML =html_search_result_add_group_admin_modal;
  if(search_result_add_group_admin_modal.length == 0)
    $('div#search-member-to-be-admin').removeClass('dropdown open');
}

$('input#search-member-to-be-admin').on('keyup', function(e) {
    search_term = $('input#search-member-to-be-admin').val();

    var http = new XMLHttpRequest();
    http.open("POST", "/group/quickSearchWithinGroupMemberNotAdmin", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "search_term=" + search_term+"&group_id=" + group_id;
    http.send((params));
    http.onload = function() {
      search_result_add_group_admin_modal = JSON.parse(http.responseText);
      if(search_result_add_group_admin_modal.length == 0){
        $('div#search-member-to-be-admin').removeClass('dropdown open');
      }else{
        $('div#search-member-to-be-admin').addClass('dropdown open');
        updateListSearchResultAddGroupAdmin()
      }
    }
    
  });

var list_member_group_to_be_choose_as_admin=[];

function isIdInArray(id, array){
  for (var i = array.length - 1; i >= 0; i--) {
    if(array[i]._id == id)
      return true
  }
  return false;
}

function addMemberToTheListModalAddGroupAdmin(_id, email, name){
  list_member_group_to_be_choose_as_admin.pushIfNotExist({
    '_id' : _id,
    'name': name,
    'email': email
    },function(e) {  
    return e.name === name && e.email === email; 
  });
  updateListUserToBeAddedAsGroupAdmin();
  updateListSearchResultAddGroupAdmin();
}

function removeMemberFromListModalAddGroupAdmin(index){
  list_member_group_to_be_choose_as_admin.splice(index, 1);
  updateListUserToBeAddedAsGroupAdmin();
  updateListSearchResultAddGroupAdmin();
}

function updateListUserToBeAddedAsGroupAdmin(){
  var list_users = '';
  for (var i = 0; i <= list_member_group_to_be_choose_as_admin.length - 1;  i++) {
      list_users += "<div class=\"btn\" style=\"padding: 0px; margin: 5px\">"+
                      "<button style=\"  border-top-right-radius: 0em;   border-bottom-right-radius: 0em;\""+
                      "class=\"btn btn-primary pull-left\"  onclick=\"openProfileInNewTab('/profile/"+list_member_group_to_be_choose_as_admin[i].email+"')\">"+
                      list_member_group_to_be_choose_as_admin[i].name+"</button>"+
                      "<button style=\"border-top-left-radius: 0em;   border-bottom-left-radius: 0em;\""+
                      "class=\"btn btn-danger pull-left\"  onclick=\"removeMemberFromListModalAddGroupAdmin("+i+")\">X</button></div>";

  }
  document.getElementById('list_member_group_to_be_choose_as_admin').innerHTML = list_users;
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

function clearSearchTermAddGroupAdminModal(){
  $('input#search-member-to-be-admin').val('');
  $('div#search-member-to-be-admin').removeClass('dropdown open');
  $('input#search-member-to-be-admin').focus();
}

// alert(group_id+ " "+user_id)

function addMemberAsGroupAdmin(){
  members_id = new Array();
  for (var i = list_member_group_to_be_choose_as_admin.length - 1; i >= 0; i--) {
    members_id.push(new Object(list_member_group_to_be_choose_as_admin[i]._id));
  }
  var http = new XMLHttpRequest();
  http.open("POST", "/group/membership/addAdmin", true);
  http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var params = "group_id=" + group_id+"&user_id=" + user_id+
  "&members_id="+members_id+"&group_accessibility="+group_accessibility;
  // alert()
  http.send(params);
  http.onload = function() {
    var result = JSON.parse(http.responseText);
    $('input#close-modal-create-new-group').click();
    if(result.status == 1){
        window.location.href= "/group/members/"+result.message.group_id;
    }else{
      alert("failed add admin")
    }
  }
}
