var fs = require('fs');
var Client = require('node-rest-client').Client;
var async = require('async');
var requestify = require('requestify'); 
var client = new Client();
var rimraf = require('rimraf');

var Post = require('../../dbhelper/post_model');
var User = require('../../dbhelper/user_model');

var general_func = require('../../controller/common/general_func');

var HostServer = require('../../private_data/agent_files/hostServer');

var host = HostServer.name;

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function asyncProcessPer100User(req, arrayUserBehaviour, randomOrder, 
	limit, firstIndex, callbackRequestHandler){
	partOfRandomOrder = randomOrder.slice(firstIndex,firstIndex+limit);
	async.forEachOf(partOfRandomOrder, function(currentOrder, index, cb) {
	    
		async.waterfall([
			function(callback){
				console.log("URL : "+host+"/API/getProfile/"+arrayUserBehaviour[currentOrder].userToken)
				console.log("\n"+index + ': ' + currentOrder+"   token: "+arrayUserBehaviour[currentOrder].userToken)
	        	client.get(host+"/API/getProfile/"+arrayUserBehaviour[currentOrder].userToken,
	        		function(userProfile){
	        			if (userProfile != 'Bad Request'){
		        			console.log("sebelum ini "+userProfile)
		        			asyncExecuteUserAction(req, userProfile, arrayUserBehaviour[currentOrder], function(){
								// console.log(index + '=== ' + currentOrder)
					    			callback(null, firstIndex);

							});
						}else{
							callback(null, firstIndex);
						}
	    		});		    	
			}
			],
			function(err, finalResponse){
				// console.log("index ============================================== " + finalResponse)
				cb();
			}
		);	
	}, function() {
	 	// console.log("====" +(parseInt(firstIndex)+limit));
	 	if((firstIndex+2*limit) < randomOrder.length-1){
	 		firstIndex += limit; 
	 		// console.log("yes " + firstIndex);
	 		asyncProcessPer100User(req, arrayUserBehaviour, randomOrder, 
				limit, firstIndex, function(){

		 			callbackRequestHandler("Partition success!");
				
				})
	 	}else{

		 	if((firstIndex+limit) == randomOrder.length){
				callbackRequestHandler("Partition success! ");
			}else{
		 		// console.log("no " + (parseInt(randomOrder.length)- firstIndex - limit));
		 		firstIndex += limit;
		 		limit = (randomOrder.length)- firstIndex;
		 		asyncProcessPer100User(req, arrayUserBehaviour, randomOrder, 
					limit, firstIndex, function(){

			 			callbackRequestHandler("Partition success!");
				})
		 	}
		 }
	 //    
	})
}



function asyncExecuteUserAction(req, userProfile, userBehaviour, callbackFunc){
	// execute user's actions
	action = userBehaviour.determineAction;
	choosePost = userBehaviour.choosePost;
	console.log("hmmmm  "+userProfile)
	async.forEachOf(action, function(currentAction, indexAction, cbAction) {

	        asyncExecuteOneAction(0, req, userProfile, indexAction, currentAction,
	        	choosePost[indexAction], function (){
	        		cbAction();
	 		});	
		}, function() {
		callbackFunc();
		return;
	});
}

function asyncExecuteOneAction(iteration, req, userProfile, indexAction, action, choosePost, callbackFunc){
	// execute each user's action
	iteration = parseInt(iteration);
	// console.log("ini yang ke "+iteration)
  if(iteration > 5){
  	// console.log("Cannot find suitable Post!! after "+iteration+" iteration! "+action+ 
  		// "  "+choosePost+"  "+userProfile.email);
	callbackFunc();
	return;
  }else{
	switch(action) {
	    case '0':
			if(req.session.idPeopleDoingAddFriend == null){
				req.session.idPeopleDoingAddFriend = userProfile.email ;
		        // console.log("	AddFriend "+userProfile.email);
		        if(userProfile.connections != undefined)
			        idForSearch = userProfile.connections.slice();
				else
					idForSearch = [];
			    idForSearch.push(userProfile._id);
		        requestify.post(host+'/API/getListPeople', {
			        limit: 10,
			        idForSearch: idForSearch
			    })
			    .then(function(response) {
			        people = response.getBody();
			        if(people.length==0){
			       		// console.log("There is no people to be added as friend!");
							req.session.idPeopleDoingAddFriend = null;
			       		callbackFunc();
						return;
			        }else{
				        selectedPeople = people[general_func.randomIntFromInterval(0, people.length-1)];
						requestify.get(host+'/API/addFriend/'+
							userProfile._id+"/"+selectedPeople._id).then(function(response) {
						    // console.log(response.getBody());

							req.session.idPeopleDoingAddFriend = null;
					    	callbackFunc();
							return;
						});
					}
			    });
			}else{
		    	var delay=50; //1 seconds
			  	setTimeout(function(){
			  		iteration++;
			    	asyncExecuteOneAction(iteration, req, userProfile, indexAction, action, choosePost, function(){
				    	callbackFunc();
						return;
			    	});
			  	}, delay); 
			}
	        break;
	    case '1':
	        // console.log("	CreatePost");
	        requestify.post(host+'/API/createPost', {
		        idUser: userProfile._id,
				content: general_func.randomChars(general_func.randomIntFromInterval(100,500)),
				title: general_func.randomChars(general_func.randomIntFromInterval(15,33)),
				keywords: general_func.randomChars(general_func.randomIntFromInterval(10,25))
		    })
		    .then(function(response) {
		     		// console.log(response.getBody());

            		callbackFunc();
					return;
			});
	        break;
	    case '2':
	        // console.log("	SharePost");
			if(req.session.arrayPeopleDoingShare.indexOf(userProfile._id) == -1){
				// this user doesn't has any other process who is doing liking
				req.session.arrayPeopleDoingShare.push(userProfile._id);

		        asyncChoosePost(req, choosePost, userProfile, function (post){
					if(post == "no_result"|| post.creator == userProfile._id || (post.share.indexOf(userProfile._id) != -1) || (post.title == null)){
		        		iteration++;
		        		// console.log("already shared!"+iteration);

		                index = req.session.arrayPeopleDoingShare.indexOf(userProfile._id);
		                req.session.arrayPeopleDoingShare.splice(index,1);

				    	asyncExecuteOneAction(iteration, req, userProfile, indexAction, action, choosePost, function(){
					    	callbackFunc();
							return;
				    	});
		        	}else{
		        		// real post
			        	requestify.post(host+'/API/sharePost', {
					        idUser: userProfile._id,
							idPost: post._id,
							idOriginalCreator: post.creator,
							content: (general_func.randomChars(general_func.randomIntFromInterval(100,300)))  
					    })
					    .then(function(response) {
					     		// console.log(response.getBody());

				                index = req.session.arrayPeopleDoingShare.indexOf(userProfile._id);
				                req.session.arrayPeopleDoingShare.splice(index,1);
			            		callbackFunc();
								return;
						});
					}
		 		});	

			}else{
		    	var delay=50; //1 seconds
			  	setTimeout(function(){
			  		iteration++;
			    	asyncExecuteOneAction(iteration, req, userProfile, indexAction, action, choosePost, function(){
				    	callbackFunc();
						return;
			    	});
			  	}, delay); 
			}
		    break;

	    case '3':
	        // console.log("	CommentPost");
	        asyncChoosePost(req, choosePost, userProfile, function (post){
	          if(post != "no_result" ){
	        	requestify.post(host+'/API/commentPost', {
			        idUser: userProfile._id,
					idPost: post._id,
					content: general_func.randomChars(general_func.randomIntFromInterval(50,300))
			    })
			    .then(function(response) {
			     		// console.log(response.getBody());

	            		callbackFunc();
						return;
				});
			  }else{
  				// console.log("Cannot find suitable Post for give a comment!");
        		callbackFunc();
				return;
			  }
	 		});	
		    break;

	    case '4':
	        // console.log("	LikePost "+iteration);
			if(req.session.arrayPeopleDoingLike.indexOf(userProfile._id) == -1){
				// this user doesn't has any other process who is doing liking
				req.session.arrayPeopleDoingLike.push(userProfile._id);
		        asyncChoosePost(req, choosePost, userProfile, function (post){
		        	if(post == "no_result" || post.like.indexOf(userProfile._id) != -1){
		        		iteration++;
		        		// console.log("failed like!"+iteration);

		                index = req.session.arrayPeopleDoingLike.indexOf(userProfile._id);
		                req.session.arrayPeopleDoingLike.splice(index,1);
				    	
				    	asyncExecuteOneAction(iteration, req, userProfile, indexAction, action, choosePost, function(){
					    	callbackFunc();
							return;
				    	});
		        	}else{
		        		// real post
			        	requestify.post(host+'/API/likePost', {
				        idUser: userProfile._id,
						idPost: post._id
					    })
					    .then(function(response) {

				                index = req.session.arrayPeopleDoingLike.indexOf(userProfile._id);
				                req.session.arrayPeopleDoingLike.splice(index,1);
						    	
			            		callbackFunc();
								return;
						});
					}
		 		});	

			}else{
				
		    	var delay=50; //1 seconds
			  	setTimeout(function(){
			  		iteration++;

			    	asyncExecuteOneAction(iteration, req, userProfile, indexAction, action, choosePost, function(){
				    	// console.log("BENTROOOOOOOOOOOOOOKKKKKKKK "+req.session.arrayPeopleDoingLike)
				    	callbackFunc();
						return;
			    	});
			  	}, delay); 
			}
		    break;
		}
	}
}

function asyncChoosePost(req, choosePost, userProfile, callbackFuncPost){
	switch(choosePost){
	    case '0':
	        // console.log("		ReccPostHigh");
	        requestify.post(host+'/API/getReccPost', {
		        connections: userProfile.connections,
		        sorting_type: 'desc', // decreasing
		        isCreatorPopulated: false
			    })
			    .then(function(response) {
			    	posts = response.getBody()

			    	if(posts != "no_recc_topic"){
						selectedId = general_func.randomIntFromInterval(0, posts.length-1)
			     		// console.log(posts.length+"choose timeline's post "+selectedId+" ___ "+posts[selectedId]);
			     		callbackFuncPost(posts[selectedId]);
					}else{
						callbackFuncPost("no_result")
					}
					return;
			});
	        break;
	    case '1':
	        // console.log("		ReccPostLow");
	        requestify.post(host+'/API/getReccPost', {
		        connections: userProfile.connections,
		        sorting_type: 'asc', // menaik
		        isCreatorPopulated: false
			    })
			    .then(function(response) {
			    	posts = response.getBody()
			    	if(posts != "no_recc_topic"){
						selectedId = general_func.randomIntFromInterval(0, posts.length-1)
			     		// console.log(posts.length+"choose timeline's post "+selectedId+"  "+posts[selectedId]);
			     		callbackFuncPost(posts[selectedId]);
					}else{
						callbackFuncPost("no_result")
					}
					return;
			});
	        break;
	    case '2':
	        // console.log("		Timeline");
			idForHome = userProfile.connections.slice();;
			idForHome.push(userProfile._id);
	        requestify.post(host+'/API/getTimeLine', {
		        connections: idForHome,
		        post_index: 'asc', // menaik
		        numOfPost: 30
			    })
			    .then(function(response) {
			    	posts = response.getBody()
					if(posts != "no_timeline_post"){
						selectedId = getRandomIndexOfTimeline(req, posts.length-1);
			     		// console.log(posts.length+" choose timeline's post "+selectedId);
			     		callbackFuncPost(posts[selectedId]);
					}else{
						callbackFuncPost("no_result")
					}
					return;
			});
	        break;
	    case '3':
	        // console.log("		Random");
	        client.get(host+"/API/getRandomPost", 
				 function (post) {
            		callbackFuncPost(post);
					return;
			});
	        break;
    }
}

function getRandomIndexOfTimeline(req, length){
	// prepare array of probability representation
	arrayProbability = new Array();
	for (var i = 0; i <= length - 1; i++) {
		for (var j = 1; j <= length - i; j++) {
			arrayProbability.push(i);
		};
	};
	// console.log(arrayProbability)
	//shuffle the array
	arrayProbability = shuffleArray(arrayProbability);
	index = general_func.randomIntFromInterval(0, length-1);
	return arrayProbability[index];
}

function getRandomOrder(numOfUser){
	randomOrder = new Array();
	for (var i = numOfUser - 1; i >= 0; i--) {
		randomOrder.push(i);
	};
	return shuffleArray(randomOrder);
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getArrayUserBehaviour(admin){
	arrayUserBehaviour = new Array();
	dataUserToken =  fs.readFileSync('././private_data/agent_files/userToken.txt', 'utf8') ;
	dataUserToken = dataUserToken.split(",");
	dataUserToken.pop();
	dataUserToken = shuffleArray(dataUserToken);
	// console.log(dataUserToken);
	k = 0;
	for (var i = 0; i <= admin.arrayOfBehaviour.length - 1; i++) {
		// process each behaviour group
		numUser = admin.arrayOfBehaviour[i].numberOfUser;
		result = getActionRepresentation(admin.numberOfAction, 
			admin.arrayOfBehaviour[i].probAddFriend,
			admin.arrayOfBehaviour[i].probCreatePost,
			admin.arrayOfBehaviour[i].probSharePost,
			admin.arrayOfBehaviour[i].probCommentPost,
			admin.arrayOfBehaviour[i].probLikePost);
		strChoosePost =  getChoosingPostRepresentation(
			admin.arrayOfBehaviour[i].probReccPostHigh,
			admin.arrayOfBehaviour[i].probReccPostLow, 
			admin.arrayOfBehaviour[i].probTimeline,
			admin.arrayOfBehaviour[i].probRandom,
			result.numPostOperation);

		for (var j = numUser - 1; j >= 0; j--) {

			currentChoosePost = strChoosePost.slice(0);
			currentAction = result.strAction.slice(0);
			objUserBehaviour = new Object();
			
			objUserBehaviour.userToken = dataUserToken[k]; 
			objUserBehaviour.determineAction =  shuffleArray(currentAction);
			objUserBehaviour.choosePost = getChoosingPostBehaviour(objUserBehaviour.determineAction,
				shuffleArray(currentChoosePost));
			// console.log(objUserBehaviour)
			arrayUserBehaviour.push(objUserBehaviour);
			k++;
		};
	};
	// console.log(arrayUserBehaviour);
	return arrayUserBehaviour;
}

function getChoosingPostBehaviour(determineAction,strChoosePost){
	// console.log(strChoosePost+"   "+determineAction);
	for (var i = 0; i <= determineAction.length - 1; i++) {
		if(parseInt(determineAction[i]) <= 1){
			strChoosePost.splice(i, 0, "_");
			// console.log(i +"  "+strChoosePost)
		}
	};
	return strChoosePost;
}


function getActionRepresentation(numberOfAction, probAddFriend, probCreatePost, probSharePost, probCommentPost, probLikePost)
{
    var0 = Math.floor(probAddFriend/100*numberOfAction);
    var1 = Math.floor(probCreatePost/100*numberOfAction);
    var2 = Math.floor(probSharePost/100*numberOfAction); //need to choose a post
    var3 = Math.floor(probCommentPost/100*numberOfAction);//need to choose a post
    var4 = Math.floor(probLikePost/100*numberOfAction);//need to choose a post
    strAction = new Array();
    for (var i = var0; i > 0; i--) {
    	strAction.push("0"); //probAddFriend representation
    };
    for (var i = var1; i > 0; i--) {
    	strAction.push("1"); //probCreatePost representation
    };
    for (var i = var2; i > 0; i--) {
    	strAction.push("2"); //probSharePost representation
    };
    for (var i = var3; i > 0; i--) {
    	strAction.push("3"); //probCommentPost representation
    };
    for (var i = var4; i > 0; i--) {
    	strAction.push("4"); //probLikePost representation
    };
    result = new Object();
    result.strAction = strAction;
    result.numPostOperation = var2+var3+var4;
    // console.log(strAction+" "+var0+" "+var1+" " +var2+" "+var3+" "+var4)
   
    return result;
}


function getChoosingPostRepresentation(probReccPostHigh, probReccPostLow, probTimeline, probRandom, numberOfAction)
{
    var0 = Math.floor(probReccPostHigh/100*numberOfAction);
    var1 = Math.floor(probReccPostLow/100*numberOfAction);
    var2 = Math.floor(probTimeline/100*numberOfAction);
    var3 = numberOfAction-var0-var1-var2;
    strAction = new Array();
    for (var i = var0; i > 0; i--) {
    	strAction.push("0"); //probAddFriend representation
    };
    for (var i = var1; i > 0; i--) {
    	strAction.push("1"); //probCreatePost representation
    };
    for (var i = var2; i > 0; i--) {
    	strAction.push("2"); //probSharePost representation
    };
    for (var i = var3; i > 0; i--) {
    	strAction.push("3"); //probCommentPost representation
    };
    // console.log("post :"+strAction);
    return strAction;
}

function reccursiveSignUp(token, arrayUser, num, callback){
	console.log("coming");
	if(num == -1){
		token +=',';
		fs.appendFile("././private_data/agent_files/userToken.txt", token, function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    result = new Object();
		    result.message =  "Success create "+arrayUser.length+" new users.\nUser's token is saved in the file!";
			result.created = (arrayUser.length);
			callback(result);
			return;
		}); 

	}else{
		client.get(host+"/API/signUp/"+arrayUser[num].email+"/"+arrayUser[num].name, 
			function (data) {
				if(data=="Bad Request"){
					if(arrayUser.length-num-1 > 0)
						token +=',';
					fs.appendFile("././private_data/agent_files/userToken.txt", token, function(err) {
					    if(err) {
					        return console.log(err);
					    }
					    result = new Object();
					    result.message =  "Success created "+(arrayUser.length-num-1)+
							" user. \nProcess is stopped after getting an error when insert "+arrayUser[num].email+
							". \nThat email is already used!"+
							"\nUser's token is saved in the file!";
						result.created = (arrayUser.length-num-1);
						callback(result);
						return;
					});
				}else{
					token.push(data);
					num -= 1;
					reccursiveSignUp( token, arrayUser, num, function(token){
						callback(token);
						return;
					});
				}
		});
	}
};

module.exports = { 
	showAgentPage: function(req, res){
		dataUserToken =  fs.readFileSync('././private_data/agent_files/userToken.txt', 'utf8') ;
		dataUserToken = dataUserToken.split(",");

		req.session.admin.numberOfSavedUserToken = dataUserToken.length-1;
		if(req.session.admin.numberOfSavedUserToken >= 1){
			req.session.tokenForBackDoor = dataUserToken[0];
		}

		totalUserInGroup = 0;
		for (var i = req.session.admin.arrayOfBehaviour.length - 1; i >= 0; i--) {
		 	totalUserInGroup +=  parseInt(req.session.admin.arrayOfBehaviour[i].numberOfUser);
		 };
		res.render('agent', {admin : req.session.admin, 
			tokenForBackDoor: req.session.tokenForBackDoor,
			totalUserInGroup: totalUserInGroup});
	},

	getSavedToken: function(req, res){
		dataUserToken =  fs.readFileSync('././private_data/agent_files/userToken.txt', 'utf8') ;
		dataUserToken = dataUserToken.split(",");
		str = "";
		for (var i = 0; i <= dataUserToken.length - 2; i++) {
			str += "<br>" +(i+1) +"  "+ dataUserToken[i] ;
		};
		res.send("User Token: "+str);
	},

	useTokenBackDoor: function(req, res){
		if(req.params.userToken.length != 15){
			res.send("Sorry, your token is not valid!")
		}
		else{
			client.get(host+"/API/getProfile/"+req.params.userToken,
        		function(userProfile){
    				if (userProfile != 'Bad Request'){
	        			req.session.profile = userProfile;
	        			res.redirect('/');
					}else{
						res.send("Sorry, your email address is not valid!")
					}
				});
		}
	},

	useEmailBackDoor: function(req, res){
		if(validateEmail(req.params.email)){
			client.get(host+"/API/getProfile/email/"+req.params.email,
			function(userProfile){
    			if (userProfile != 'Bad Request'){
					req.session.profile = userProfile;
					res.redirect('/');
				}else{
					res.send("Sorry, your email address is not valid!")
				}
			});
		}else{
			res.send("Sorry, your email address is not valid!")
		}
	},

	startTestAgent: function(req, res){
		arrayUserBehaviour = getArrayUserBehaviour(req.session.admin);
		randomOrder = getRandomOrder(arrayUserBehaviour.length);

		req.session.idPeopleDoingAddFriend = null;
		req.session.arrayPeopleDoingLike = new Array();
		req.session.arrayPeopleDoingShare = new Array();
		numberOfPartition = parseInt(req.session.admin.numberOfPartition);
		asyncProcessPer100User(req, arrayUserBehaviour, randomOrder, 
			numberOfPartition, 0, function(status){
				// console.log(status);
				req.session.idPeopleDoingAddFriend = null;
				req.session.arrayPeopleDoingLike = new Array();
				req.session.arrayPeopleDoingShare = new Array();
		});
		res.send("Still process "+arrayUserBehaviour.length+" users!! ");
	},

	generateUser: function(req, res){
		dataUser =  fs.readFileSync('././private_data/agent_files/generatedUser.txt', 'utf8') ;
		// console.log("dataUser  "+dataUser) 
		var generatedUser = new Array;
	  	generatedUser = JSON.parse(dataUser);
	  	// console.log(generatedUser);
    	max = 1999; min = 0;
    	var arrayUser = new Array();
		for (var i = req.params.numberOfUser; i >= 1; i--) {
			index = Math.floor(Math.random() * (max - min + 1)) + min;
			console.log("index oy "+index) 
			email = generatedUser[index].email+general_func.randomChars(5)+".com";
			name = generatedUser[index].name;
			user = new Object();
			user.email = email;
			user.name = name;
			// console.log("index oy "+user) 
			arrayUser.push(user);
		}
		// console.log("arrayUser  "+arrayUser);
		token = new Array();			
		async.waterfall([
			function(callback){
				reccursiveSignUp(token, arrayUser,arrayUser.length-1, callback);
			}
			],
			
			function(finalResponse){
				req.session.admin.numberOfSavedUserToken += finalResponse.created;
				res.send(finalResponse);
			}
		);		
	},

	setNumberOfUserPerBehaviour: function(req, res){
		admin = req.session.admin;
		find = false;
		for (var i = 0; !find && i <= admin.arrayOfBehaviour.length - 1; i++) {
			if(admin.arrayOfBehaviour[i].index == req.params.index){
				admin.arrayOfBehaviour[i].numberOfUser = req.params.value;
				find = true;
			}
		};
		req.session.admin = admin;
		res.send(req.params.value);
	},

	login: function(req, res){
		var email = req.body.email;
		var password = req.body.password;
		if( email == "daniar.h.k@gmail.com" && password == "8kendalrejo4") {

			dataUserToken =  fs.readFileSync('././private_data/agent_files/userToken.txt', 'utf8') ;
			dataUserToken = dataUserToken.split(",");
			arrayBehaviourFromFile =  fs.readFileSync('././private_data/agent_files/agentBehaviour.txt', 'utf8') ;
			if(arrayBehaviourFromFile != null)
				arrayBehaviourFromFile = JSON.parse(arrayBehaviourFromFile);

			admin = new Object();
			admin.login = true;
			admin.numberOfSavedUserToken = dataUserToken.length-1;
			admin.numberOfAction = 2;
			admin.numberOfPartition = 1;
			admin.arrayOfBehaviour = arrayBehaviourFromFile;

	    	req.session.admin = admin;
	    	res.redirect('/agent');
	    } else {
			res.render('agentLogin', { Message: 'Username or password is incorrect!' });
	    }
	},

	addUserBehaviour: function(req, res){
		admin = req.session.admin;
			objBehaviour = new Object(); 
			if(admin.arrayOfBehaviour.length > 0)
				objBehaviour.index = admin.arrayOfBehaviour[admin.arrayOfBehaviour.length-1].index+1;
			else
				objBehaviour.index = 0;
			objBehaviour.probReccPostHigh = 0;
			objBehaviour.probReccPostLow = 0;
			objBehaviour.probTimeline = 0;
			objBehaviour.probRandom = 0;
			objBehaviour.probAddFriend = 0;
			objBehaviour.probCreatePost = 0;
			objBehaviour.probSharePost = 0;
			objBehaviour.probCommentPost = 0;
			objBehaviour.probLikePost = 0;
			objBehaviour.numberOfUser = 0;
		admin.arrayOfBehaviour.push(objBehaviour);
		    
	    	req.session.admin = admin;
	    	// console.log(req.session.admin);
	    	res.send(admin);
	},

	updateUserBehaviourFile: function(req, res){
		admin = req.session.admin;		
		fs.writeFile("././private_data/agent_files/agentBehaviour.txt", JSON.stringify(admin.arrayOfBehaviour), function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    res.send("success");
		}); 
	},

	clearSavedToken: function(req, res){
		admin = req.session.admin;		
		fs.writeFile("././private_data/agent_files/userToken.txt",'', function(err) {
		    if(err) {
		        return console.log(err);
		    }
			rimraf('public/images/*/', function(err){
				if(err)
					console.log(err)
		    	res.send("success");
			})
		}); 
	},

	deleteUserBehaviour: function(req, res){
		admin = req.session.admin;
		find = false;
		for (var i = 0; !find && i <= admin.arrayOfBehaviour.length - 1; i++) {
			if(admin.arrayOfBehaviour[i].index == req.params.index){
				admin.arrayOfBehaviour.splice(i,1);
				find = true;
			}
		};
    	req.session.admin = admin;
    	res.send(""+req.params.index);
	},

	updateUserBehaviourFile: function(req, res){
		admin = req.session.admin;		
		fs.writeFile("././private_data/agent_files/agentBehaviour.txt", JSON.stringify(admin.arrayOfBehaviour), function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    res.send("success");
		}); 
	},


}

