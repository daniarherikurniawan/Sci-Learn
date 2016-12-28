$('input#search-connection').on('focusout', function(e) {
	var delay=200; //1 second
	setTimeout(function() {
		$('div#search-connection').removeClass('dropdown open');
	}, delay);
});
$('input#search-connection').on('keyup', function(e) {
    var http = new XMLHttpRequest();
    http.open("POST", "/connections/searchNewConnection", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    search_term = $('input#search-connection').val();
    var params = "search_term=" + window.encodeURIComponent(search_term);
    http.send((params));
    http.onload = function() {
    	var search_result = JSON.parse(http.responseText);
    	if(search_result.length == 0){
			$('div#search-connection').removeClass('dropdown open');
    	}else{
			$('div#search-connection').addClass('dropdown open');
	    	html_search_result = '';
	    	for ( i = 0;i <=search_result.length - 1 ; i++) {
	    		if (i != 7){
		    		html_search_result += 
	    			"<li><a  href=\"/profile/"+search_result[i].email+"\">"+search_result[i].name+"</a></li>"
	          	}
	          };
	          if(search_result.length == 8){
	          	html_search_result += 
	    			"<li style=\"text-align:center\"><a style=\"margin-top: 4px;    padding-left: 17px; \" href=\"/search?search_term="+search_term+"\">See all result</a></li>"
	          }
	        document.getElementById('search-connection-result').innerHTML =html_search_result;
    	}
    }
    
  });

