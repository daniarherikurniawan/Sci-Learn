
$('input#search-within-group-members').on('focusout', function(e) {
  var delay=200; //1 second
  setTimeout(function() {
    $('div#search-within-group-members').removeClass('dropdown open');
  }, delay);
});

$('input#search-within-group-members').on('keyup', function(e) {
    search_term = $('input#search-within-group-members').val();
    if (e.which == 13 && ! e.shiftKey) {
      window.location.href= "/group/members/"+group_id+"/"+search_term;
    }else{
      var http = new XMLHttpRequest();
      http.open("POST", "/group/quickSearchWithinGroupMember", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "search_term=" + search_term+"&group_id=" + group_id;
      http.send((params));
      http.onload = function() {
        var search_result = JSON.parse(http.responseText);
        if(search_result.length == 0){
        $('div#search-within-group-members').removeClass('dropdown open');
        }else{
        $('div#search-within-group-members').addClass('dropdown open');
          html_search_result = '';
          for ( i = 0;i <=search_result.length - 1; i++) {
            if(i != 7){
              html_search_result += 
                "<li><a  href=\"/profile/"+search_result[i].email+"\">"+search_result[i].name+"</a></li>"
                };
            }
            if(search_result.length == 8){
              html_search_result += 
            "<li style=\"text-align:center\"><a style=\"margin-top: 4px;    padding-left: 17px; \" href=\"/group/members/"+group_id+"/"+search_term+"\">See all result</a></li>"
            }
            document.getElementById('search-within-group-members-result').innerHTML =html_search_result;
        }
      }
    }
  });

$('button#search-within-group-members').on('click', function(e){
    search_term = $('input#search-within-group-members').val();
    link = "/group/members/"+group_id+"/"+search_term;
    // console.log(link)
    window.location.href= link;
    
})


