
function sendLinkTask3(){
var http = new XMLHttpRequest();
    http.open("GET", "/agent/HDEChallenge", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      alert(http.responseText)
      if (http.readyState == 4 && http.status == 200) {

        location.reload();
      }
    };
}

function clearSavedToken(){
  var http = new XMLHttpRequest();
    http.open("GET", "/agent/clearSavedToken", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        location.reload();
      }
    };
      return false;

}

function openBackDoor(){
  token = document.getElementById('userTokenBackDoor').value;
  if(token.length != 15 )
    token="error"
  window.open("/agent/backDoor/"+token, '_blank');
}

function openBackDoorByEmail(){
  email = document.getElementById('userTokenBackDoor').value;
  window.open("/agent/backDoor/email/"+email,'_blank');
}


function startTestAgent(){
  var http = new XMLHttpRequest();
    http.open("GET", "/agent/startTestAgent", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    // alert("Starting test agent!")
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        // alert("ssss "+http.responseText);
        document.getElementById('resultTesting').innerHTML = http.responseText;
      }
    };
      return false;
}



function addBehaviour(index){
  var http = new XMLHttpRequest();
    http.open("GET", "/agent/addBehaviour/"+index, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        // alert(http.responseText);
        document.getElementById('addIndex'+index).innerHTML = document.getElementById("templateAddBehaviour").innerHTML;
      }
    };
      return false;
}


function updateBehaviourFile(){
  // alert("aaaa")
  var http = new XMLHttpRequest();
    http.open("GET", "/agent/updateBehaviourFile", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        location.reload();
      }
    };
      return false;
}

function deleteBehaviour(index){
  var http = new XMLHttpRequest();
    http.open("GET", "/agent/deleteBehaviour/"+index, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        updateBehaviourFile();
      }
    };
      // return false;
}


 function generateUser(){
    numberOfUser = document.getElementById('numberOfUser').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/generateUser/"+numberOfUser, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        alert(JSON.parse(http.responseText).message);
        document.getElementById('numberOfSavedUserToken').innerHTML = parseInt(document.getElementById('numberOfSavedUserToken').innerHTML)+parseInt(JSON.parse(http.responseText).created);
        location.reload();
      }
    };
      return false;
  };

function setNumberOfPartition(){
    value = document.getElementById('numberOfPartition').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setNumberOfPartition/"+value, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responseSetNumberOfPartition').innerHTML =http.responseText;
       updateBehaviourFile(); 
      }
    };
      return false;
  }


function setNumberOfUserOnGroup(index){
    value = document.getElementById('numberOfUserOnGroup'+index).value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setNumberOfUserOnGroup/"+index+"/"+value, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsenumberOfUserOnGroup'+index).innerHTML =http.responseText;
       updateBehaviourFile(); 
      }
    };
      return false;
  }


  function setNumberOfAction(){
    numberOfAction = document.getElementById('numberOfAction').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setNumberOfAction/"+numberOfAction, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsenumberOfAction').innerHTML =http.responseText;
      }
    };
      return false;
  }

  function setProbReccPostHigh(index){
    ProbReccPostHigh = document.getElementById('ProbReccPostHigh').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setProbReccPostHigh/"+index+"/"+ProbReccPostHigh, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsesetProbReccPostHigh').innerHTML =http.responseText;
      }
    };
      return false;
  }

  function setProbReccPostLow(index){
    ProbReccPostLow = document.getElementById('ProbReccPostLow').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setProbReccPostLow/"+index+"/"+ProbReccPostLow, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsesetProbReccPostLow').innerHTML =http.responseText;
      }
    };
      return false;
  }

  function setProbTimeline(index){
    ProbTimeline = document.getElementById('ProbTimeline').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setProbTimeline/"+index+"/"+ProbTimeline, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsesetProbTimeline').innerHTML =http.responseText;
      }
    };
      return false;
  }

  function setProbRandom(index){
    ProbRandom = document.getElementById('ProbRandom').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setProbRandom/"+index+"/"+ProbRandom, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsesetProbRandom').innerHTML =http.responseText;
      }
    };
      return false;
  }







  function setProbAddFriend(index){
    value = document.getElementById('probAddFriend').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setProbAddFriend/"+index+"/"+value, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsesetProbAddFriend').innerHTML =http.responseText;
      }
    };
      return false;
  }

  function setProbCreatePost(index){
    value = document.getElementById('probCreatePost').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setProbCreatePost/"+index+"/"+value, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsesetProbCreatePost').innerHTML =http.responseText;
      }
    };
      return false;
  }

  function setProbSharePost(index){
    value = document.getElementById('probSharePost').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setProbSharePost/"+index+"/"+value, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsesetProbSharePost').innerHTML =http.responseText;
      }
    };
      return false;
  }

  function setProbCommentPost(index){
    value = document.getElementById('probCommentPost').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setProbCommentPost/"+index+"/"+value, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsesetProbCommentPost').innerHTML =http.responseText;
      }
    };
      return false;
  }

  function setProbLikePost(index){
    value = document.getElementById('probLikePost').value;
    var http = new XMLHttpRequest();
    http.open("GET", "/agent/setProbLikePost/"+index+"/"+value, true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        document.getElementById('responsesetProbLikePost').innerHTML =http.responseText;
      }
    };
      return false;
  }

