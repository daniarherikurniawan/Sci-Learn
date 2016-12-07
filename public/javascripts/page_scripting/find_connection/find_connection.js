 str = "";
  if(showByQuery && numOfCurrPage <= numOfLastPage){
      limitIndexPage = 10;
      if(numOfLastPage < 10)
        limitIndexPage = numOfLastPage-1;

      firstIndexPage = 1; //numOfLastPage
      if(numOfCurrPage > 5)
        if( numOfCurrPage+5 <= numOfLastPage)
          firstIndexPage = numOfCurrPage-5;
        else 
          firstIndexPage = numOfLastPage - limitIndexPage;

      //add first page
      str +=  "<li";
      if(1 == numOfCurrPage)
          str += " class=\"active\"";
      str += "><a href=\"/search/"+search_term+0+"/"+limitPerPage+"\">"+'First'+"</a></li>";


      //add first intermediate page
      if(numOfLastPage > 11 && 2 < firstIndexPage+1){
        intermediateIndex = Math.ceil(firstIndexPage/2);
        str +=  "<li><a href=\"/search/"+search_term+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
      }

      lastIndexPage = firstIndexPage + limitIndexPage - 1;

      for (var i = firstIndexPage+1; i <= lastIndexPage; i++) {
        str +=  "<li";
        if(i == numOfCurrPage)
          str += " class=\"active\"";
        str += "><a href=\"/search/"+search_term+(i-1)+"/"+limitPerPage+"\">"+(i)+"</a></li>";
      };  

      //add last intermediate page
      if(numOfLastPage > 11 && (numOfLastPage-1) > lastIndexPage){
        intermediateIndex = Math.floor(lastIndexPage+((numOfLastPage - lastIndexPage) /2)-1);
        str +=  "<li><a href=\"/search/"+search_term+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
      }

       //add last page
      if(numOfLastPage > 1){
        str +=  "<li";
        if(numOfLastPage == numOfCurrPage)
            str += " class=\"active\"";
        str += "><a href=\"/search/"+search_term+(numOfLastPage-1)+"/"+limitPerPage+"\">"+'Last'+"</a></li>";
      }
    

      lastResult = 0;
      if(numOfCurrPage==numOfLastPage){
        lastResult = numOfPeople;
      }
      else
        lastResult = (numOfCurrPage*(limitPerPage+0));
      document.getElementById("pagination").innerHTML = str;
      document.getElementById("messageStatus").innerHTML = "Showing "+(((parseInt(numOfCurrPage)-1)*parseInt(limitPerPage))+1)+" - "+lastResult+" results";
      document.getElementById("statePage").innerHTML = "<b>Page "+numOfCurrPage+" of "+numOfLastPage+"<b>"
  }else{
      document.getElementById("messageStatus").innerHTML = "Showing "+numOfPeople+" results";
      document.getElementById("statePage").innerHTML = ""

}



  function triggermyNewProfilePicture() {
    document.getElementById("myNewProfilePicture").click();

  }

  function submitForm(){
  var delay=2000; //1 seconds
  setTimeout(function(){
    document.getElementById("submitPicture").submit();
   // window.alert("Photo profile is successfully updated!");
  }, delay); 
}

function tryToConnect(id, name) {
    
    var http = new XMLHttpRequest();
    http.open("POST", "/addConnection", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "id=" + id+""; // probably use document.getElementById(...).value
    http.send(params);
    http.onload = function() {
      if(http.responseText==404){
        //error
        alert(http.responseText);
      }else{ 
          $('#messageStatus').text("Congratulations! \r\ Now you're connected with "+name+" !");
        var id="#"+http.responseText;
        $(id).remove();
        iAmOnline(http.responseText);
      }
    }
}
