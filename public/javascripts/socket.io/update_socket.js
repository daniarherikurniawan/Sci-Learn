
      var socket = io.connect();
      var $nickForm = $('#setNick');
      var $nickError = $('#nickError');
      var $nickBox = $('#nickname');
      var $users = $('#users');
      var $messageForm = $('#send-message');
      var $messageBox = $('#message');
      var $chat = $('#chat');
      var profile;

        function iAmOnline(_id){
            //just add someone that probably online
            data = new Object();
            data._id = _id;
            console.log("tellMyNewFriends here!!");
            socket.emit('tellMyNewFriends', data);
        }

        



       function updateOnlinePanel(id){
//           // alert('need Update (ready)');
//           var http = new XMLHttpRequest();
//           http.open("POST", "/updateOnlineConnection", true);
//           http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//           var params = "id=" + window.encodeURIComponent(id)+ "&type="+window.encodeURIComponent("update");
//           http.send((params));
//           http.onload = function() {
//             if(http.responseText=="404"){
//               //error
//               alert(http.responseText);
//             }else{
//           // alert(http.responseText);
//               var onlineUsers = JSON.parse(http.responseText);
//               // $('#listOnlineConnection').val("lala");
//               var str = "";
//               for (var i = onlineUsers.length - 1; i >= 0; i--) {
//                 str = str + "<a  class=\"list-group-item\">"+
//               onlineUsers[i].name +"<i class=\"pull-right fa fa-circle-o-notch fa-spin\" "+
//               "style=\"color:#3b9798\"></i> </a>";
//               };
// //               document.getElementById('numberOnlineUser').innerHTML = onlineUsers.length;
//               document.getElementById('listOnlineConnection').innerHTML = str;
//             }
//             // alert("holaa "+onlineUsers);
//           }
      }

jQuery(function($){

      var http = new XMLHttpRequest();
      http.open("POST", "/profile", true);
      http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      http.send();
      http.onload = function() {      
        profile =   JSON.parse(http.responseText);
        socket.emit('online',profile);

      }



      $nickForm.submit(function(e){
        // alert("lala");
        e.preventDefault();
        socket.emit('new user', $nickBox.val(), function(data){
          if(data){
            $('#nickWrap').hide();
            $('#contentWrap').show();
          } else{
            $nickError.html('That username is already taken!  Try again.');
          }
        });
        $nickBox.val('');
      });

      socket.on('user disconnected', function(data){
        // alert("user id : "+data.id+" disconnected!");
          // var http = new XMLHttpRequest();
          // http.open("POST", "/updateOnlineConnection", true);
          // http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
          // var params = "id=" + window.encodeURIComponent(data.id)+ "&type="+window.encodeURIComponent("delete");
          // http.send((params));
          // http.onload = function() {
          //   if(http.responseText=="404"){
          //     //error
          //     alert(http.responseText);
          //   }else{
          //      var onlineUsers = JSON.parse(http.responseText);
          //     // $('#listOnlineConnection').val("lala");
          //     var str = "";
          //     for (var i = onlineUsers.length - 1; i >= 0; i--) {
          //       str = str + "<a  class=\"list-group-item\">"+
          //     onlineUsers[i].name +"<i class=\"pull-right fa fa-circle-o-notch fa-spin\" "+
          //     "style=\"color:#3b9798\"></i> </a>";
          //     };
          //     document.getElementById('numberOnlineUser').innerHTML = onlineUsers.length;
          //     document.getElementById('listOnlineConnection').innerHTML = str;
          //   }
          // }
      });

      socket.on('user online', function(data){
          // alert("someone added you!")
//           var http = new XMLHttpRequest();
//           http.open("POST", "/updateOnlineConnection", true);
//           http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//           var params = "id=" + window.encodeURIComponent(data.id)+ "&type="+window.encodeURIComponent("add");
//           http.send((params));
//           http.onload = function() {
//             if(http.responseText=="404"){
//               //error
//               alert(http.responseText);
//             }else{
//           // alert(http.responseText);
//               var onlineUsers = JSON.parse(http.responseText);
//               // $('#listOnlineConnection').val("lala");
//               var str = "";
//               for (var i = onlineUsers.length - 1; i >= 0; i--) {
//                 str = str + "<a  class=\"list-group-item\">"+
//               onlineUsers[i].name +"<i class=\"pull-right fa fa-circle-o-notch fa-spin\" "+
//               "style=\"color:#3b9798\"></i> </a>";
//               };
// //               document.getElementById('numberOnlineUser').innerHTML = onlineUsers.length;
//               document.getElementById('listOnlineConnection').innerHTML = str;
//               socket.emit('update', data.id);
//               // alert("socket.emit('update', data.id);"+data.id);
//             }
//           }
      });

      socket.on('updateYourOwn', function(id){
        // alert(id+"nih "+"updateOnlinePanel");
        // updateOnlinePanel(id);
      });


      socket.on('usernames', function(data){
        var html = '';
        for(i=0; i < data.length; i++){
          html += data[i] + '<br/>'
        }
        $users.html(html);
      });
      
      $messageForm.submit(function(e){
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), function(data){
          $chat.append('<span class="error">' + data + "</span><br/>");
        });
        $messageBox.val('');
      });
      
      socket.on('new message', function(data){
        $chat.append('<span class="msg"><b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
      });
      
      socket.on('whisper', function(data){
        $chat.append('<span class="whisper"><b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
      });
    });