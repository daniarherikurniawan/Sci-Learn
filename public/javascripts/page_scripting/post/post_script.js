
  function tryToShare(id_post, original_creator){
    // alert("ahooy");
    var content =  $('#additionalThought').val();
    console.log("tryToshare wooy")
    var http = new XMLHttpRequest();
    if(showGroupPost)
      http.open("POST", "/group/addShare", true);
    else
      http.open("POST", "/addShare", true);

    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "id_post=" + window.encodeURIComponent(id_post)+ "&content="+window.encodeURIComponent(content)+ "&original_creator="+window.encodeURIComponent(original_creator); // probably use document.getElementById(...).value
    http.send((params));
    http.onload = function() {
      if(http.responseText=="404"){
        //error
        alert(http.responseText);
      }else{
          location.reload();
      }
    }
  }

  function initiateSharedThought(id,id_creator){
     var http = new XMLHttpRequest();
      http.open("POST", "/dataPost", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "id=" + window.encodeURIComponent(id);
      http.send((params));
      http.onload = function() {
        if(http.responseText=="404"){
          //error
          alert(http.responseText);
        }else{
          post = JSON.parse(http.responseText);
          document.getElementById('sharedName').innerHTML = post.creator.name ; 
          document.getElementById('sharedKeywords').innerHTML = post.keywords;
          document.getElementById('sharedTitle').innerHTML = post.title; 
          $('#linkSharedImage').attr('href',"/profile/"+post.creator.email);
          // alert($('#sourceSharedImage').attr('src'));
          $('#sourceSharedImage').attr('src',"/images/"+post.creator.email+"/profile/"+post.creator.img_profile_name);
          
          $('input#editableShareFunction').attr("onclick", "return tryToShare('"+id+"','"+id_creator+"')");
          $('#additionalThought').val("");
          $('#additionalThought').first().focus();
        }
      }
  }

function test(str){
  alert(str);
}

function triggermyNewProfilePicture() {
  document.getElementById("myNewProfilePicture").click();

}

function submitForm(){
  var delay=200; //1 seconds
  setTimeout(function(){
    document.getElementById("submitPicture").submit();
    //window.alert("Photo profile is successfully updated!");
  }, delay); 
}

  var genuine = null;

  function editPost(id,id_creator){
    if (genuine == null){
      var newValue = "cancelEditPost('"+id+"')";
      $('#targetId').attr('onclick',newValue);
      var newAction = "/updatePost/"+id+"/"+id_creator;
      //window.alert(newAction);
      $('#needAction').attr('action',newAction);
      document.getElementById('editableTitle').innerHTML = document.getElementById(""+id+'editableTitle').textContent;
      document.getElementById('editableName').innerHTML = document.getElementById(""+id+'editableName').textContent;
      document.getElementById('editableImage').innerHTML = document.getElementById(""+id+'editableImage').innerHTML;
      document.getElementById('editableKeywords').innerHTML =   document.getElementById(""+id+'editableKeywords').textContent;
      document.getElementById('editableContent').innerHTML =   document.getElementById(""+id+'editableContent').textContent;
      genuine = document.getElementById(id).innerHTML;
      var template = document.getElementById('templateEdit').innerHTML;
      document.getElementById(id).innerHTML = template;
      init("editableContent",0);
    }else{
      window.alert("You should finish your current editing before edit another one! ")
    }
  }
  //567d12d5e5e456ea33c7fb94

  function editSharePost(id,id_creator){
    if (genuine == null){
      var newValue = "cancelEditPost('"+id+"')";
      $('#targetIdShare').attr('onclick',newValue);
      var newAction = "/updateSharePost/"+id+"/"+id_creator;
      //window.alert(newAction);
      $('#needActionShare').attr('action',newAction);
      document.getElementById('editableNameShare').innerHTML = document.getElementById(""+id+'editableName').textContent;
      document.getElementById('editableImageShare').innerHTML = document.getElementById(""+id+'editableImage').innerHTML;
      document.getElementById('editable_shared_post').innerHTML = document.getElementById(""+id+'_shared_post').innerHTML;
      document.getElementById('editableContentShare').innerHTML =   document.getElementById(""+id+'editableContent').textContent;
      genuine = document.getElementById(id).innerHTML;
      var template = document.getElementById('templateEditShare').innerHTML;
      document.getElementById(id).innerHTML = template;
      init("editableContentShare",0);
    }else{
      window.alert("You should finish your current editing before edit another one! ")
    }
  }

  function cancelEditPost(id){
    document.getElementById(id).innerHTML = genuine  ;
    genuine = null;
  }


  function tryToDelete(id, id_creator) {
    var http = new XMLHttpRequest();
    if(showGroupPost)
      http.open("POST", "/group/deletePost", true);
    else
      http.open("POST", "/deletePost", true);

    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "id=" + window.encodeURIComponent(id)+ "&creator="+window.encodeURIComponent(id_creator); // probably use document.getElementById(...).value
    http.send((params));
    http.onload = function() {
      if(http.responseText=="404"){
        alert(http.responseText);
      }else{
        if(http.responseText == "shared_post"){
          location.reload();
        }else{
          var id="#"+http.responseText;
          $(id).remove();
        }
      }
    }
  }


  function tryToDeleteComment(id, post_id) {
    var http = new XMLHttpRequest();
    if(showGroupPost)
      http.open("POST", "/group/deleteComment", true);
    else
      http.open("POST", "/deleteComment", true);

    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "id=" + window.encodeURIComponent(id)+ "&post_id="+window.encodeURIComponent(post_id); // probably use document.getElementById(...).value
    http.send((params));
    http.onload = function() {
      if(http.responseText=="404"){
        //error
        alert(http.responseText);
      }else{
        //refresh comment
        commentNumber = document.getElementById('comment'+post_id)
        .innerHTML.replace('&nbsp; ','').replace(' ','');
          // alert  ;
          document.getElementById('comment'+post_id).innerHTML = "&nbsp; "+((+commentNumber)-1);
          showComments(post_id);
        }
      }
    }

// give comment
// I should filter whether is it a tag inthe string or not
$(function() {
  $('input#comment').on('keyup', function(e) {
    if (e.which == 13 && ! e.shiftKey) {
      var id = this.name;
      var content = $(this).val();
      if (content.length > 0){
        var http = new XMLHttpRequest();
        if(showGroupPost)
          http.open("POST", "/group/addComment", true);
        else
          http.open("POST", "/addComment", true);
        http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        var params = "id=" + window.encodeURIComponent(id)+ "&creator="+window.encodeURIComponent(id_creator)
           +"&content="+window.encodeURIComponent(content); // probably use document.getElementById(...).value

           http.send((params));
           http.onload = function() {
            if(http.responseText=="404"){
            //error
            alert(http.responseText);
          }else{
            //alert(http.responseText);
            var commentNumber = document.getElementById('comment'+id)
            .innerHTML.replace('&nbsp; ','').replace(' ','');
            // alert  ;
            document.getElementById('comment'+id).innerHTML = "&nbsp; "+((+commentNumber)+1);
            var name = "input[name="+id+"]";
            $(name).attr("placeholder", "Your comment has been added ..");
            $(name).val("");
            showComments(id);
          }
         }
      }
    }
  });

});

function hideComments(id2){
 iddNew="showComment"+id2;
 newOnClick2 = "showComments('"+id2+"')";
 buttonOnClick = "#button"+id2;
 $(buttonOnClick).css("color", "#3b9798");
 $(buttonOnClick).attr("onClick", newOnClick2);
 document.getElementById(iddNew).innerHTML ="";
}


function showComments(id3){
    
    normalizeButton(id3);
    //getElementById("showComment"+id).innerHTML = "lalala";
    post_id = id3;
    var http = new XMLHttpRequest();
    http.open("POST", "/getComment", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "id=" + window.encodeURIComponent(id3);
    http.send((params));
    http.onload = function() {
      if(http.responseText=="404"){
          //error
          alert(http.responseText);
        }else{


         comments = JSON.parse(http.responseText);

          //build the comments div
          newComments = "";
          for ( i = 0;i <=  comments.length - 1; i++) {

            newComments += 
            "<div class=\"well\" style=\"padding:10px 15px 10px 15px; margin-bottom:0px\"> "+
            "<div class=\"row\">"+
            "<div class=\"col-sm-1 pull-left\" style=\"padding: 0 0 0 0 ; "+
            "width:40px;height:40px;overflow:hidden\">"+
            "<img style=\"width:40px;  position: absolute; left: 50%; top: 50%; "+
            "-webkit-transform: translateY(-50%) translateX(-50%);  -moz-transform: translateY(-50%) translateX(-50%) ;\"src=\"/images/"+
            comments[i].creator.email+"/profile/"+comments[i].creator.img_profile_name+"\">"+
            "</div>"+
            "<div class=\"col-sm-10 pull-left\" style=\"padding: 0 0 0px 0px; margin: 0 0 0px 10px; width: 82%;\">"+
            "<a href=\"/profile/"+
            comments[i].creator.email+"\"><b>"+
            comments[i].creator.name+"</b></a>"+
            "</div>";

            if(comments[i].creator.email == myEmail){

              newComments += "<div class=\"col-sm-1 \" style=\"margin-top: 0px;padding-right: 0px;padding-top: 0px; float: left;\">"+
              " <li class=\"dropdown\" style=\"list-style-type: none;  text-align: right;\">"+
              "<a href=\"\" data-toggle=\"dropdown\"><i class=\"glyphicon glyphicon-chevron-down\" style=\""+"top:1px; font-size: 12px;\"></i></a>"+
              "<ul class=\"dropdown-menu\" style=\"left:-75px; top:16px;    min-width: 103px; \">"+
              "<li><a class=\"btn \" type=\"button\" style=\"text-align: left;\" onclick=\"editComment('"+comments[i]._id+"','"+post_id+"')\"><i "+"class=\"glyphicon glyphicon-pencil\" style=\"font-size:12px; color:black\"  ></i>&nbsp; Edit</a></li>"+
              "<li>"+
              " <a class=\"btn\" style=\"text-align: left;\"  type=\"button\" onclick=\"tryToDeleteComment('"+comments[i]._id+"','"+post_id+"')\"><i "+"class=\"glyphicon glyphicon-remove \"  style=\"font-size:12px; color:black\"></i>&nbsp; "+"Delete</a></li>"+
              "</ul>"+
              " </li>"+
              "</div>";
            }


            newComments += "<div class=\"col-sm-10 pull-left\" style=\"padding: 0 0 0px 0px; overflow-wrap: break-word; "+
            "margin: 0 0 0 10px\">"+
            comments[i].content+"</div>"+
            "</div>"+
            "</div>";

          };
          // alert(newComments);
          //put generated html to the div
          buttonOnClick = "#button"+id3;
          newOnClick = "hideComments('"+id3+"')";
          $(buttonOnClick).attr("onClick", newOnClick);
          $(buttonOnClick).css("color", "rgb(45, 99, 99)");
          idd="showComment"+id3;
          document.getElementById(idd).innerHTML =newComments;
        }

        
      }

    }

function hideLike(id2){
  // alert("lalal");
 iddNew="showComment"+id2;
 newOnClick2 = "showLikes('"+id2+"')";
 buttonOnClick = "#buttonLike"+id2;
 $(buttonOnClick).css("color", "#3b9798");
 $(buttonOnClick).attr("onClick", newOnClick2);
 document.getElementById(iddNew).innerHTML ="";
 // alert( $(buttonOnClick).attr("onClick"));
}



function hideShare(id2){
  // alert("lalal");
 iddNew="showComment"+id2;
 newOnClick2 = "showShares('"+id2+"')";
 buttonOnClick = "#buttonShare"+id2;
 $(buttonOnClick).css("color", "#3b9798");
 $(buttonOnClick).attr("onClick", newOnClick2);
 document.getElementById(iddNew).innerHTML ="";
 // alert( $(buttonOnClick).attr("onClick"));
}


function showLikes(id3){
    
    normalizeButton(id3);
    //getElementById("showComment"+id).innerHTML = "lalala";
    // alert("lalala");
    post_id = id3;
    var http = new XMLHttpRequest();
    http.open("POST", "/getLike", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "id=" + window.encodeURIComponent(id3);
    http.send((params));
    http.onload = function() {
      if(http.responseText=="404"){
          //error
          alert(http.responseText);
        }else{

         likes = JSON.parse(http.responseText);

          //build the comments div
          newLike = "";
          // alert("dd  "+likes.length)
          for ( i = 0;i <=likes.length - 1; i++) {

            newLike += 
            "<div class=\"well\" style=\"padding:10px 15px 10px 15px; margin-bottom:0px\"> "+
            "<div class=\"row\">"+
            "<div class=\"col-sm-1 pull-left\" style=\"padding: 0 0 0 0 ; "+
            "width:40px;height:40px;overflow:hidden\">"+
            "<img style=\"width:40px;  position: absolute; left: 50%; top: 50%; "+
            "-webkit-transform: translateY(-50%) translateX(-50%);  -moz-transform: translateY(-50%) translateX(-50%) ;\"src=\"/images/"+
            likes[i].email+"/profile/"+likes[i].img_profile_name+"\">"+
            "</div>"+
            "<div class=\"col-sm-10 pull-left\" style=\"padding: 0 0 0px 0px; margin: 0 0 0px 10px\">"+
            "<a href=\"/profile/"+
            likes[i].email+"\"><b>"+
            likes[i].name+"</b></a>"+
            "</div>";

            newLike += "<div class=\"col-sm-10 pull-left\" style=\"padding: 0 0 0px 0px; overflow-wrap: break-word; "+
            "margin: 0 0 0 10px\">"+
            likes[i].occupation+"</div>"+
            "</div>"+
            "</div>"+
            "</div>";

          };
          // alert(newLike);
          //put generated html to the div
          buttonOnClick = "#buttonLike"+id3;
          newOnClick = "hideLike('"+id3+"')";
          $(buttonOnClick).attr("onClick", newOnClick);
          $(buttonOnClick).css("color", "rgb(45, 99, 99)");
          idd="showComment"+id3;
          document.getElementById(idd).innerHTML =newLike;
        }

        
      }

    }

function normalizeButton(id3){
          idd="showComment"+id3;
          document.getElementById(idd).innerHTML ="";
   $('#buttonLike'+id3).css('color','#3b9798');
    $('#buttonLike'+id3).attr('onClick',"showLikes('"+id3+"')");
   $('#buttonShare'+id3).css('color','#3b9798');
    $('#buttonShare'+id3).attr('onClick',"showShares('"+id3+"')");
   $('#button'+id3).css('color','#3b9798');
    $('#button'+id3).attr('onClick',"showComments('"+id3+"')");
    // alert("hhhho");
}

function showShares(id3){
    
    normalizeButton(id3);

    // alert('lala');
    //getElementById("showComment"+id).innerHTML = "lalala";
    // alert("lalala");
    post_id = id3;
    var http = new XMLHttpRequest();
    http.open("POST", "/getShare", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "id=" + window.encodeURIComponent(id3);
    http.send((params));
    http.onload = function() {
      if(http.responseText=="404"){
          //error
          alert(http.responseText);
        }else{

         likes = JSON.parse(http.responseText);

          //build the comments div
          newLike = "";
          // alert("dd  "+likes.length)
          for ( i = 0;i <=likes.length - 1; i++) {

            newLike += 
            "<div class=\"well\" style=\"padding:10px 15px 10px 15px; margin-bottom:0px\"> "+
            "<div class=\"row\">"+
            "<div class=\"col-sm-1 pull-left\" style=\"padding: 0 0 0 0 ; "+
            "width:40px;height:40px;overflow:hidden\">"+
            "<img style=\"width:40px;  position: absolute; left: 50%; top: 50%; "+
            "-webkit-transform: translateY(-50%) translateX(-50%);  -moz-transform: translateY(-50%) translateX(-50%) ;\"src=\"/images/"+
            likes[i].email+"/profile/"+likes[i].img_profile_name+"\">"+
            "</div>"+
            "<div class=\"col-sm-10 pull-left\" style=\"padding: 0 0 0px 0px; margin: 0 0 0px 10px\">"+
            "<a href=\"/profile/"+
            likes[i].email+"\"><b>"+
            likes[i].name+"</b></a>"+
            "</div>";

            newLike += "<div class=\"col-sm-10 pull-left\" style=\"padding: 0 0 0px 0px; overflow-wrap: break-word; "+
            "margin: 0 0 0 10px\">"+
            likes[i].occupation+"</div>"+
            "</div>"+
            "</div>"+
            "</div>";

          };
          // alert(newLike);
          //put generated html to the div
          buttonOnClick = "#buttonShare"+id3;
          newOnClick = "hideShare('"+id3+"')";
          $(buttonOnClick).attr("onClick", newOnClick);
          $(buttonOnClick).css("color", "rgb(45, 99, 99)");
          idd="showComment"+id3;
          document.getElementById(idd).innerHTML =newLike;
        }        
      }
    }


    function sendShare(id){
      var http = new XMLHttpRequest();
      if(showGroupPost)
        http.open("POST", "/group/addShare", true);
      else
        http.open("POST", "/addShare", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "id=" + window.encodeURIComponent(id);        
      http.send((params));
      http.onload = function() {
        alert(http.responseText);
      }
    }



    function sendLike(id){
      var http = new XMLHttpRequest();
      if(showGroupPost)
        http.open("POST", "/group/addLike", true);
      else
        http.open("POST", "/addLike", true);

      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var params = "id=" + window.encodeURIComponent(id);        
      http.send((params));
      http.onload = function() {
        if(http.responseText=="404"){
          //error
          alert(http.responseText);
        }else{
          var likeNumber = document.getElementById('like'+id)
          .innerHTML.replace('&nbsp; ','').replace(' ','');
          button = "#iconLike"+id;
          if(http.responseText=="like"){
            document.getElementById('like'+id).innerHTML = "&nbsp; "+((+likeNumber)+1);
            $(button).css("background-color", "#d6e7e8");
            $(button).css("border-color", "#d6e7e8");
          }else{
            document.getElementById('like'+id).innerHTML = "&nbsp; "+((+likeNumber)-1);
            $(button).css("background-color", "#FFFFFF");
            $(button).css("border-color", "#E7ECE5");
          }
        }
      }
    }



    var observe;
    if (window.attachEvent) {
      observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
      };
    }
    else {
      observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
      };
    }
    function init(id_str, delay) {
      var delay=(+delay); //1 seconds
      setTimeout(function(){ var text = document.getElementById(id_str);
        function resize () {
          text.style.height = 'auto';
          text.style.height = text.scrollHeight+'px';
        }
        /* 0-timeout to get the already changed text */
        function delayedResize () {
          window.setTimeout(resize, 0);
        }
        observe(text, 'change',  resize);
        observe(text, 'cut',     delayedResize);
        observe(text, 'paste',   delayedResize);
        observe(text, 'drop',    delayedResize);
        observe(text, 'keydown', delayedResize);

        text.focus();
        text.select();
        resize();
      }, delay); 

}