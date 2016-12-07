  str = "";

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


      //add first page
      str +=  "<li";
      if(1 == numOfCurrPage)
          str += " class=\"active\"";
      str += "><a href=\"/home/"+0+"/"+limitPerPage+"\">"+'First'+"</a></li>";

      //add first intermediate page
      if(numOfLastPage > 11 && 2 < firstIndexPage+1){
        intermediateIndex = Math.ceil(firstIndexPage/2);
        str +=  "<li><a href=\"/home/"+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
      }

      lastIndexPage = firstIndexPage + limitIndexPage - 1;
      for (var i = firstIndexPage + 1; i <= lastIndexPage; i++) {
        str +=  "<li";
        if(i == numOfCurrPage)
          str += " class=\"active\"";
        str += "><a href=\"/home/"+(i-1)+"/"+limitPerPage+"\">"+(i)+"</a></li>";
      };

      //add last intermediate page
      if(numOfLastPage > 11 && (numOfLastPage-1) > lastIndexPage){
        intermediateIndex = Math.floor(lastIndexPage+((numOfLastPage - lastIndexPage) /2)-1);
        str +=  "<li><a href=\"/home/"+(intermediateIndex)+"/"+limitPerPage+"\">"+"..."+"</a></li>";
      }

       //add last page
      if(numOfLastPage > 1){
        str +=  "<li";
        if(numOfLastPage == numOfCurrPage)
            str += " class=\"active\"";
        str += "><a href=\"/home/"+(numOfLastPage-1)+"/"+limitPerPage+"\">"+'Last'+"</a></li>";
      }

      
      if(statePageCondition){
        // alert("dd")
        $("#pagination").remove();
        if(lastResult != 0)
          document.getElementById("statePage").innerHTML = "Showing "+((numOfCurrPage-1)*limitPerPage+1)+" - "+lastResult+" posts<p>";
        else
          document.getElementById("statePage").innerHTML = "There is no posts at this time!";

       }else {
          document.getElementById("pagination").innerHTML = str;
          document.getElementById("statePage").innerHTML = "Showing "+((numOfCurrPage-1)*limitPerPage+1)+" - "+lastResult+" posts<p><b>Page "+numOfCurrPage+" out of "+numOfLastPage+"<b></p>";
        }
  }