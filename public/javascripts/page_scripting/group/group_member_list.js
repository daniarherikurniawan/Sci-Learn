html_input = "";
admin = "";
normal_member = "";

var http = new XMLHttpRequest();
http.open("POST", "/user/getDataUserProfilePicture", true);
http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
var params = "idUsers=" + group_members;
http.send((params));
http.onload = function() {
	var data_members = JSON.parse(http.responseText);
	if(data_members.status == 0){
		alert(data_members)
	}else{
		for (var i = 0; i <= data_members.message.length - 1; i++) {
			if(isInArray(data_members.message[i]._id, group_admin)){
				admin += "<div style=\" display:inline-block;     margin: 0px 4px 4px 0px;\">"+
			      " <img style=\"width:45px; margin:1px \" title=\""+
			      data_members.message[i].name+" (group admin)\" src=\"/images/"+data_members.message[i].email+"/profile/"+
			      data_members.message[i].img_profile_name+"\"> </div>";
			}else{
				normal_member += "<div style=\" display:inline-block;     margin: 0px 4px 4px 0px;\">"+
			      " <img style=\"width:45px; margin:1px \" title=\""+
			      data_members.message[i].name+" \" src=\"/images/"+data_members.message[i].email+"/profile/"+
			      data_members.message[i].img_profile_name+"\"> </div>";
			}
		}
 		 document.getElementById('show-group-member-list').innerHTML = admin +"<hr style= 'margin: 5px 3px 8px 0px;'>"+ normal_member;
	}
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}