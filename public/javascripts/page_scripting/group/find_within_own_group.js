
$('input#search-within-own-group').on('focusout', function(e) {
  var delay=200; //1 second
  setTimeout(function() {
    $('div#search-within-own-group').removeClass('dropdown open');
  }, delay);
});

$('input#search-within-own-group').on('keyup', function(e) {
    search_term = $('input#search-within-own-group').val();
    if (e.which == 13 && ! e.shiftKey) {
      window.location.href= "/groups/"+profile_id+"/"+search_term;
    }else{
      var http = new XMLHttpRequest();
      http.open("POST", "/group/quickSearchWithinOwnGroup", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "search_term=" + search_term+"&profile_id=" + profile_id;
      http.send((params));
      http.onload = function() {
        var search_result = JSON.parse(http.responseText);
        if(search_result.length == 0){
          $('div#search-within-own-group').removeClass('dropdown open');
        }else{
          $('div#search-within-own-group').addClass('dropdown open');
            html_search_result = '';
            for ( i = 0;i <=search_result.length - 1; i++) {
              if(i != 7){
                html_search_result += 
                  "<li><a  href=\"/group/"+search_result[i]._id+"\">"+search_result[i].group_name+"</a></li>"
                  };
              }
              if(search_result.length == 8){
                html_search_result += 
              "<li style=\"text-align:center\"><a style=\"margin-top: 4px;    padding-left: 17px; \" href=\"/groups/"+profile_id+"/"+search_term+"\">See all result</a></li>"
              }
            document.getElementById('search-within-own-group-result').innerHTML =html_search_result;
        }
      }
    }
  });

$('button#search-within-own-group').on('click', function(e){
    search_term = $('input#search-within-own-group').val();
    link ="/groups/"+profile_id+"/"+search_term;
    // console.log(link)
    window.location.href= link;
    
})


