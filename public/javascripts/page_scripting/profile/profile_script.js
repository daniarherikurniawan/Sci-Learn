 function tryToConnect(id, name) {
      // alert(id+"  "+name);
      var http = new XMLHttpRequest();
      http.open("POST", "/addConnection", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "id=" + id+""; // probably use document.getElementById(...).value
      http.send(params);
     http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
          location.reload();
          iAmOnline(http.responseText);
        }
      }
      return true;
  }


  function tryToGetToken(){
    var http = new XMLHttpRequest();
      http.open("GET", "/getToken", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      http.send();
      http.onload = function() {
        if(http.responseText==404){
          //error
          alert(http.responseText);
        }else{ 
          
          prompt("Copy to clipboard: Ctrl+C, Enter",http.responseText);
        }
      }
  }

  function openNewPage(){
    var http = new XMLHttpRequest();
      http.open("POST", "/connections/56a869e0bb201b72319646f7", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "page=" + 1; // probably use document.getElementById(...).value
      http.send((params));
      http.onload = function() {
        // if(http.responseText=="404"){
        //   //error
        //   alert(http.responseText);
        // }else{
        
        // }
      }
  }


  str = "";
    // just base condition 
    if(numOfCurrPage <= numOfLastPage){
      limitIndexPage = 10;
      if(numOfLastPage < 10)
        limitIndexPage = numOfLastPage-1;

      firstIndexPage = 1; //numOfLastPage
      if(numOfCurrPage > 5)
        if( numOfCurrPage+5 <= numOfLastPage)
          firstIndexPage = numOfCurrPage-5;
        else 
          firstIndexPage = numOfLastPage - limitIndexPage;

      if(show_friends){
        // show friends / connections
        //add first page
        str +=  "<li";
        if(1 == numOfCurrPage)
            str += " class=\"active\"";
        str += "><a href=\"/connections/"+profile_id+"/"+search_term_url+0+"/"+limitPerPage+"\">"+'First'+"</a></li>";


        //add first intermediate page
        if(numOfLastPage > 11 && 2 < firstIndexPage+1){
          intermediateIndex = Math.ceil(firstIndexPage/2);
          str +=  "<li><a href=\"/connections/"+profile_id+"/"+search_term_url+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
        }

        lastIndexPage = firstIndexPage + limitIndexPage - 1;


        for (var i = firstIndexPage + 1; i <= lastIndexPage; i++) {
          str +=  "<li";
          if(i == numOfCurrPage)
            str += " class=\"active\"";
          str += "><a href=\"/connections/"+profile_id+"/"+search_term_url+(i-1)+"/"+limitPerPage+"\">"+(i)+"</a></li>";
        };

        //add last intermediate page
        if(numOfLastPage > 11 && (numOfLastPage-1) > lastIndexPage){
          intermediateIndex = Math.floor(lastIndexPage+((numOfLastPage - lastIndexPage) /2)-1);
          str +=  "<li><a href=\"/connections/"+profile_id+"/"+search_term_url+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
        }

         //add last page
        if(numOfLastPage > 1){
          str +=  "<li";
          if(numOfLastPage == numOfCurrPage)
              str += " class=\"active\"";
          str += "><a href=\"/connections/"+profile_id+"/"+search_term_url+(numOfLastPage-1)+"/"+limitPerPage+"\">"+'Last'+"</a></li>";
        }
      }else if(show_activity ){
        
        //show activity
        //add first page
        str +=  "<li";
        if(1 == numOfCurrPage)
            str += " class=\"active\"";
        str += "><a href=\"/"+urlActivity+"/"+0+"/"+limitPerPage+"\">"+'First'+"</a></li>";
        //add first intermediate page
        if(numOfLastPage > 11 && 2 < firstIndexPage+1){
          intermediateIndex = Math.ceil(firstIndexPage/2);
          str +=  "<li><a href=\"/"+urlActivity+"/"+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
        }

        lastIndexPage = firstIndexPage + limitIndexPage - 1;


        for (var i = firstIndexPage+1; i <= lastIndexPage ; i++) {
          str +=  "<li";
          if(i == numOfCurrPage)
            str += " class=\"active\"";
          str += "><a href=\"/"+urlActivity+"/"+(i-1)+"/"+limitPerPage+"\">"+(i)+"</a></li>";
        };  
        
        //add last intermediate page
        if(numOfLastPage > 11 && (numOfLastPage-1) > lastIndexPage){
          intermediateIndex = Math.floor(lastIndexPage+((numOfLastPage - lastIndexPage) /2)-1);
          str +=  "<li><a href=\"/"+urlActivity+"/"+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
        }
        
         //add last page
        if(numOfLastPage > 1){
          str +=  "<li";
          if(numOfLastPage == numOfCurrPage)
              str += " class=\"active\"";
          str += "><a href=\"/"+urlActivity+"/"+(numOfLastPage-1)+"/"+limitPerPage+"\">"+'Last'+"</a></li>";
        }
        // alert("hhhhh")
      }else{
        // show profile
        //add first page
        str +=  "<li";
        if(1 == numOfCurrPage)
            str += " class=\"active\"";
        str += "><a href=\"/profile/"+profile_email+"/"+0+"/"+limitPerPage+"\">"+'First'+"</a></li>";

        //add first intermediate page
        if(numOfLastPage > 11 && 2 < firstIndexPage+1){
          intermediateIndex = Math.ceil(firstIndexPage/2);
          str +=  "<li><a href=\"/profile/"+profile_email+"/"+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
        }

        lastIndexPage = firstIndexPage + limitIndexPage - 1;


        for (var i = firstIndexPage+1; i <= lastIndexPage ; i++) {
          str +=  "<li";
          if(i == numOfCurrPage)
            str += " class=\"active\"";
          str += "><a href=\"/profile/"+profile_email+"/"+(i-1)+"/"+limitPerPage+"\">"+(i)+"</a></li>";
        };  
        
        //add last intermediate page
        if(numOfLastPage > 11 && (numOfLastPage-1) > lastIndexPage){
          intermediateIndex = Math.floor(lastIndexPage+((numOfLastPage - lastIndexPage) /2)-1);
          str +=  "<li><a href=\"/profile/"+profile_email+"/"+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
        }
        
         //add last page
        if(numOfLastPage > 1){
          str +=  "<li";
          if(numOfLastPage == numOfCurrPage)
              str += " class=\"active\"";
          str += "><a href=\"/profile/"+profile_email+"/"+(numOfLastPage-1)+"/"+limitPerPage+"\">"+'Last'+"</a></li>";
        }

      }
        document.getElementById("pagination").innerHTML = str;
        document.getElementById("statePage").innerHTML = "Showing "+((numOfCurrPage-1)*limitPerPage+1)+" - "+lastResult+" results<p><b>Page "+numOfCurrPage+" out of "+numOfLastPage+"<b></p>";
    }