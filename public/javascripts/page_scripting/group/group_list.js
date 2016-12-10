  initiateListGroup(profile_id);
  function initiateListGroup(profile_id){
    var http = new XMLHttpRequest();
    http.open("POST", "/group/getList", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "user_id=" + window.encodeURIComponent(profile_id);
    http.send((params));
    http.onload = function() {
      result = JSON.parse(http.responseText);
      if(http.responseText=="404" || result.status == 0){
        // alert(http.responseText);
      }else{
        result = result.message;
        group_list_name = ''
        for (var i = result.length - 1; i >= 0; i--) {
        	group_list_name += "<a href=\"/group/"+result[i]._id+"\" class=\"list-group-item\">"+result[i].group_name+"</a> ";
        }
        document.getElementById('group_list').innerHTML = group_list_name;
      }
    }
  }