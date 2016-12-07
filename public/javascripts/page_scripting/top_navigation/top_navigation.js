$('input#search-connection').on('focusout', function(e) {
	var delay=1000; //1 second
	setTimeout(function() {
		$('div#search-connection').removeClass('dropdown open');
	}, delay);
});
$('input#search-connection').on('keyup', function(e) {
    var http = new XMLHttpRequest();
    http.open("POST", "/connections/searchNewConnection", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "search_term=" + $('input#search-connection').val();
    http.send((params));
    http.onload = function() {
    	var search_result = JSON.parse(http.responseText);
    	if(search_result.length == 0){
			$('div#search-connection').removeClass('dropdown open');
    	}else{
			$('div#search-connection').addClass('dropdown open');
	    	html_search_result = '';
	    	for ( i = 0;i <=search_result.length - 1; i++) {
	    		html_search_result += 
	    			"<li><a  href=\"/profile/"+search_result[i].email+"\">"+search_result[i].name+"</a></li>"
	          };
	        document.getElementById('search-connection-result').innerHTML =html_search_result;
    	}
    }
    
  });
