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
        	if(i < 7)
	        	group_list_name += "<a href=\"/group/"+result[i]._id+"\" class=\"list-group-item\">"+result[i].group_name+"</a> ";
        }
        // alert()
        if(result.length  == 8){
   			document.getElementById('show-all-groups').innerHTML = "<a href='/groups/"+profile_id+"'>See all groups</a>"     	
        }else{
        	$('#show-all-groups').attr('style', '')
        	
        	if(result.length == 0){
   				document.getElementById('show-all-groups').innerHTML = "You haven't joined to any group!"  
        	}
        }
        document.getElementById('group_list').innerHTML = group_list_name;


		$(function(){
		  if(!$('div#main').hasScrollBar()){
		    $('div#middle-display').attr('style', 'padding-right: 11px; padding-left:0px;');
		  }
		});

      }
    }
  }


(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);