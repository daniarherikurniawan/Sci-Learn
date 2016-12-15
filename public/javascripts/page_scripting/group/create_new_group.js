/*Initialization*/
$('#create_group_modal').on('shown.bs.modal', function () {
  $('textarea#group_name').focus();
}) 


function createNewGroup(){
	group_name = $('textarea#group_name').val();
	group_info = $('textarea#group_info').val();
	group_admin = profile_id;
	group_accessibility = $('select#group-accessibility').val();
	group_members = new Array();
	for (var i = list_new_member.length - 1; i >= 0; i--) {
		group_members.push(new Object(list_new_member[i]._id));
	}
  var http = new XMLHttpRequest();
  http.open("POST", "/group/createNewGroup", true);
  http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var params = "group_name=" + group_name+"&group_info=" + group_info+"&group_admin="+group_admin+
  "&group_members="+group_members+"&group_accessibility="+group_accessibility;
  // alert()
  http.send(params);
  http.onload = function() {
    var result = JSON.parse(http.responseText);
  	$('input#close-modal-create-new-group').click();
    if(result.status == 1){
      	window.location.href= "/group/"+result.message.group_id;
  	}else{
  		alert("failed create group")
  	}
  }
}