html_input = "";
admin = "";
normal_member = "";
// if(group_members.length >)
var http = new XMLHttpRequest();
http.open("POST", "/user/getDataUserProfilePicture", true);
http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
var params = "idUsers=" + member_to_display;
http.send((params));
http.onload = function() {
	var data_members = JSON.parse(http.responseText);
	if(data_members.status == 0){
		alert(data_members)
	}else{
		for (var i = 0; i <= data_members.message.length - 1; i++) {
			if(isInArray(data_members.message[i]._id, group_admin)){
				admin += 
				 "<a  href=\"/profile/"+data_members.message[i].email+"\">"+
					 "<div style=\" display:inline-block;     margin: 0px 4px 4px 0px;\">"+
				      " <img style=\"width:45px; margin:1px \" title=\""+
				      data_members.message[i].name+" (group admin)\" src=\"/images/"+data_members.message[i].email+"/profile/"+
				      data_members.message[i].img_profile_name+"\"> </div>"+
			      "</a>";
			}else{
				normal_member += 
				 "<a  href=\"/profile/"+data_members.message[i].email+"\">"+
					 "<div style=\" display:inline-block;     margin: 0px 4px 4px 0px;\">"+
				      " <img style=\"width:45px; margin:1px \" title=\""+
				      data_members.message[i].name+" \" src=\"/images/"+data_members.message[i].email+"/profile/"+
				      data_members.message[i].img_profile_name+"\"> </div>"+
			      "</a>";
			}
		}

		string_html = admin +"<hr style= 'margin: 5px 3px 8px 0px;'>"+ normal_member;
 		 if(number_of_members > 10)
 		 	string_html +="<br><div style='margin-top:8px'><a style=\"text-align:center;  \" href=\"/group/members/"+
 		 group_id+"\">See all members</a> <div>"

 		 document.getElementById('show-group-member-list').innerHTML = string_html
	}
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}