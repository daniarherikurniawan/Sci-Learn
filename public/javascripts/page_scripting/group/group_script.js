
if(group_accessibility == "Private Group"){
	document.getElementById('show-group-accessibility').innerHTML = "<i style='color: #2d6363; margin-right:3px' title='Private Group' class=\"fa fa-lock\"></i>";
}else{
	document.getElementById('show-group-accessibility').innerHTML = "<i style='color: #2d6363; margin-right:3px' title='Public Group' class=\"fa fa-globe\"></i>";
}

function deleteGroup(group_id) {
	var http = new XMLHttpRequest();
	http.open("POST", "/group/deleteGroup", true);
	http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	var params = "group_id=" + group_id;
	http.send((params));
	http.onload = function() {
		var result = JSON.parse(http.responseText);
		if(result.status == 0){
			alert(result)
		}else{
      		window.location.href= "/";
		}
	}
}