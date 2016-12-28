
$('input#search-new-member-group').on('focusout', function(e) {
  var delay=200; //1 second
  setTimeout(function() {
    // $('div#search-new-member-group').removeClass('dropdown open');
  }, delay);
});
var search_result = [];
var html_search_result =""
function updateListSearch(){
  html_search_result = "";
  for (var i = search_result.length - 1; i >= 0; i--) {
    if(isIdInArray(search_result[i]._id, list_new_member)){
      search_result.splice(i, 1);
    }
  }
  for ( i = 0;i <= search_result.length - 1; i++) {
      html_search_result += "<li><button class=\"btn btn-primary pull-left\" onclick=\"addMemberToTheList('"+
        search_result[i]._id+"','"+search_result[i].email+
        "','"+search_result[i].img_profile_name+"','"+
        search_result[i].name+"')\" style=\"margin: 3px\"><small><span class=\"glyphicon glyphicon-plus\"></span></small>&nbsp;&nbsp;&nbsp;&nbsp;"+search_result[i].name+"</button></li>"
    }
  document.getElementById('search-new-member-group-result').innerHTML =html_search_result;
  if(search_result.length == 0)
    $('div#search-new-member-group').removeClass('dropdown open');
}

$('input#search-new-member-group').on('keyup', function(e) {
    search_term = $('input#search-new-member-group').val();

      var http = new XMLHttpRequest();
      http.open("POST", "/connections/quickSearchNewMemberGroup", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "search_term=" + window.encodeURIComponent(search_term)+"&profile_id=" + window.encodeURIComponent(profile_id);
      http.send((params));
      http.onload = function() {
        search_result = JSON.parse(http.responseText);
        if(search_result.length == 0){
        $('div#search-new-member-group').removeClass('dropdown open');
        }else{
        $('div#search-new-member-group').addClass('dropdown open');
          updateListSearch()
        }
      }
  });

var list_new_member=[];

//initialization 
list_new_member.push({
  '_id' : profile_id,
  'name': profile_name,
  'email': profile_email,
  'img_profile_name': profile_img_profile_name
  });
updateListProfPic();

function isIdInArray(id, array){
  for (var i = array.length - 1; i >= 0; i--) {
    if(array[i]._id == id)
      return true
  }
  return false;
}

function addMemberToTheList(_id, email, img_profile_name, name){
  list_new_member.pushIfNotExist({
    '_id' : _id,
    'name': name,
    'email': email,
    'img_profile_name': img_profile_name
    },function(e) {  
    return e.name === name && e.email === email; 
  });
  updateListProfPic();
  updateListSearch();
}

function removeMemberFromList(index){
  list_new_member.splice(index, 1);
  updateListProfPic();
  updateListSearch();
}

function updateListProfPic(){
  var list_profpic = '';
  for (var i = list_new_member.length - 1; i >= 0; i--) {
    if(i == 0){
      //admin without remove button
      list_profpic += "<div style=\" display:inline-block;     margin: 0px 6px 6px 0px;\">"+
      " <img style=\"width:45px; margin:1px \" title=\""+
      list_new_member[i].name+" (group admin)\" src=\"/images/"+list_new_member[i].email+"/profile/"+
      list_new_member[i].img_profile_name+"\"> </div>";
    }else{
      list_profpic += "<div style=\" display:inline-block;     margin: 0px 6px 6px 0px;\">"+
      " <img style=\"width:45px; margin:1px \" title=\""+
      list_new_member[i].name+"\" src=\"/images/"+list_new_member[i].email+"/profile/"+
      list_new_member[i].img_profile_name+"\"> <a id=\"close\" onclick=\"removeMemberFromList("+i+")\" style=\"position: relative;\"></a></div>";
    }
  }
  document.getElementById('member_list').innerHTML = list_profpic;

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

function clearSearchTerm(){
  $('input#search-new-member-group').val('');
  $('div#search-new-member-group').removeClass('dropdown open');
  $('input#search-new-member-group').focus();
}