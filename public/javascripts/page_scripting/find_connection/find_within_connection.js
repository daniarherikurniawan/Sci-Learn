
$('input#search-within-connection').on('focusout', function(e) {
  var delay=200; //1 second
  setTimeout(function() {
    $('div#search-within-connection').removeClass('dropdown open');
  }, delay);
});

$('input#search-within-connection').on('keyup', function(e) {
    search_term = $('input#search-within-connection').val();
    if (e.which == 13 && ! e.shiftKey) {
      window.location.href= "/connections/"+profile_id+"/"+search_term+"/0/15";
    }else{
      var http = new XMLHttpRequest();
      http.open("POST", "/connections/quickSearchWithinConnection", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "search_term=" + window.encodeURIComponent(search_term)+"&profile_id=" + window.encodeURIComponent(profile_id);
      http.send((params));
      http.onload = function() {
        var search_result = JSON.parse(http.responseText);
        if(search_result.length == 0){
        $('div#search-within-connection').removeClass('dropdown open');
        }else{
        $('div#search-within-connection').addClass('dropdown open');
          html_search_result = '';
          for ( i = 0;i <=search_result.length - 1; i++) {
            if(i != 7){
              html_search_result += 
                "<li><a  href=\"/profile/"+search_result[i].email+"\">"+search_result[i].name+"</a></li>"
                };
            }
            if(search_result.length == 8){
              html_search_result += 
            "<li style=\"text-align:center\"><a style=\"margin-top: 4px;    padding-left: 17px; \" href=\"/connections/"+profile_id+"/"+search_term+"/0/15\">See all result</a></li>"
            }
            document.getElementById('search-within-connection-result').innerHTML =html_search_result;
        }
      }
    }
  });

$('button#search-within-connection').on('click', function(e){
    search_term = $('input#search-within-connection').val();
    link = "/connections/"+profile_id+"/"+search_term+"/0/15";
    // console.log(link)
    window.location.href= link;
    
})


