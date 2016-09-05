                          // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '161306487604464',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.6' // use version 2.2
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }


  function loginForm(){
    var loginForm = " <form class=\"form\" action=\"/login\" method=\"post\"><div class=\"well\" style=\"border-radius: 8px; padding: 12px; background: #3b9798\"><div  class=\"text-center text-warning\"style=\"color:white;\"><%Message%></div><span class=\"logo\" style=\"background-color:inherit; width: auto;     color: white; font-size:24px\"> Sci-Learn <\/span><br> <input required style=\"margin-bottom:10px\" type=\"email\" name=\"email\"class=\"form-control input-lg\" placeholder=\"Enter your email address\"> <input required style=\"margin-bottom:5px\" type=\"password\" name=\"password\" class=\"form-control input-lg\" placeholder=\"Enter your password\" maxlength=\"16\" minlength=\"8\" > </div><div class=\"text-center\"> <a onclick=\"signUpForm()\" class=\"btn btn-md btn-default\" >Sign Up for Free</a> <button class=\"btn btn-md btn-primary\" type=\"submit\">Login<\/button><\/div><\/form>"

    document.getElementById("form-login").innerHTML = loginForm;
  };

  function signUpForm(){

    var signUpForm = "<form class=\"form\" action=\"/signup\" method=\"post\"><div class=\"well\" style=\"border-radius: 8px; padding: 12px; background: #3b9798\"><div  class=\"text-center text-warning\" style=\"color:white;\"><%Message%></div><span class=\"logo\" style=\"background-color:inherit; width: auto;     color: white; font-size:24px\"> Sci-Learn <\/span><br><input required style=\"margin-bottom:10px\" type=\"name\" name=\"name\"class=\"form-control input-lg\" placeholder=\"Enter your name\"><input required style=\"margin-bottom:10px\" type=\"email\" name=\"email\"class=\"form-control input-lg\" placeholder=\"Enter your email address\"><input required style=\"margin-bottom:10px\" type=\"password\" name=\"password\" class=\"form-control input-lg\" placeholder=\"Enter your password\" maxlength=\"16\" minlength=\"8\" ><input required style=\"margin-bottom:5px\" type=\"password\" name=\"confirmed_password\" class=\"form-control input-lg\" placeholder=\"Confirm your password\" maxlength=\"16\" minlength=\"8\" ></div> <div class=\"text-center\"> <a onclick=\"loginForm()\" class=\"btn btn-md btn-default\">Login <\/a> <button class=\" btn btn-md btn-primary\" type=\"submit\">Sign Up for Free<\/button><\/div> <\/form>"

    document.getElementById("form-login").innerHTML = signUpForm;
  }
