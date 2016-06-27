var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var fs = require('fs');
var lwip = require('lwip');

/*databases connection*/
var mongo = require('./dbconfig/mongo_config');
mongo.connect();

var app = express();
app.version = "[v_0.4.2]";
// App setup
app.set('views', path.join(__dirname, 'views'));
app.locals.delimiters = '<% %>';
app.set('view engine', 'hjs');
app.set('trust proxy', 1) // trust first proxy 
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(session({
  secret: 'd432rc3487687686546c34r',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

// Router declaration
var index = require('./routes/index_router');
var agent = require('./routes/agent_router');
var profile = require('./routes/profile_router');
var api = require('./routes/api_router');  
var user = require('./routes/user_router');  
var connection = require('./routes/connection_router');
app.use('/', index);
app.use('/agent', agent);
app.use('/API', api);
app.use('/profile', profile);
app.use('/connections', connection);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.locals.getProfile = function(userToken, callback){
    mongoose.model('User').findOne({token: userToken}, function(err, user){
      if(err)
        callback(err);
      else
        callback(user);
      return ;
    });
}

app.locals.getProfileByEmail = function(email, callback){
    mongoose.model('User').findOne({email: email}, function(err, user){
      if(err)
        callback(err);
      else
        callback(user);
      return ;
    });
}

app.locals.randomChars = function(num){
    var chars = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < num; i++ )
        chars += possible.charAt(Math.floor(Math.random() * possible.length));
    return chars;
}


app.locals.getPostIdForHome = function(idForPostCreator, limit, 
  numOfCurrPage, icludeSharingPost, callback){
  firstIndex = limit*numOfCurrPage;
  if(limit != 0){ // for home page
    mongoose.model('User').find({ '_id' : {$in :idForPostCreator}})
      .populate ('online_connection' )
      .exec (function (err,users){
        if(err)
          console.log(err)
        if(users.length != 0){
          arrayPostId = new Array();
          for (var i = users.length - 1; i >= 0; i--) {
            arrayPostId.push.apply(arrayPostId,users[i].id_user_posts);
            arrayPostId.push.apply(arrayPostId,users[i].id_share_posts);
          };

          if(arrayPostId.length != 0){
            arrayPostId.sort();
            arrayPostId.reverse();
            numOfPost = arrayPostId.length;
            maxPost = parseInt(firstIndex)+parseInt(limit);
            arrayPostId =  arrayPostId.slice(firstIndex,maxPost)
            callback(arrayPostId, numOfPost);
          }else{
            //no_timeline_post
            callback(null, 0);
          }
        }else{
          //no_timeline_post
          callback(null, 0);
        }
        return;
    });
  }else{// for choosing recc topic
    mongoose.model('User').find({ '_id' : {$in :idForPostCreator}})
      .populate ('online_connection' )
      .exec (function (err,users){
        console.log("users.length : "+users.length)
        if(err)
          console.log(err)
        arrayPostId = new Array();
        if(icludeSharingPost){
          for (var i = users.length - 1; i >= 0; i--) {
            arrayPostId.push.apply(arrayPostId,users[i].id_user_posts);
            arrayPostId.push.apply(arrayPostId,users[i].id_share_posts);
          };
        }else{
          for (var i = users.length - 1; i >= 0; i--) {
            arrayPostId.push.apply(arrayPostId,users[i].id_user_posts);
          };
        }
        arrayPostId.sort(); // by id || by created date
        // arrayPostId.reverse();
        numOfPost = arrayPostId.length;
        callback(arrayPostId, numOfPost);
        return;
    });
  }
}

app.locals.getReccPost = function(connections, sorting_type, 
  isCreatorPopulated, callback){
  app.locals.getPostIdForHome(connections, 0, 0, false, 
    function(arrayPostId, numOfPost){
    //asc = increasing
    //desc = decreasing
    if (isCreatorPopulated){
      // for UI
      mongoose.model('Post')
      .find({'_id': {$in : arrayPostId}})
      .sort({post_index: sorting_type})
      .limit(5)
      .populate('creator')
      .exec(function(err,rec_topic){
        if(err)
          console.log(err)

        if(rec_topic.length == 0){
          console.log("No recommended post!")
          callback("no_recc_topic");  
        }else{
          callback(rec_topic);  

        }
        return;
      });
    }else{
      mongoose.model('Post')
      .find({'_id': {$in : arrayPostId}})
      .sort({post_index: sorting_type})
      .limit(5)
      .exec(function(err,rec_topic){
        if(err)
          console.log(err)
        console.log(typeof(rec_topic)+"^^^^^^^^^^^^^^^^rec_topic  : "+rec_topic.length)
        if(typeof(rec_topic) == "undefined" || rec_topic.length == 0){
          console.log("no_recc_topic app.js!")
          callback("no_recc_topic");  
        }else{
          // console.log("Yes recommended post!")
          callback(rec_topic);  

        }
        return;
      });
    }
  });
}

app.locals.signUp = function(email, name, callback){
  mongoose.model('User').findOne({email: email}, function(err, data){
    // console.log("email  "+email);
    if( data != null ) {
          callback(null);
          return ;
        } else { 
          password = app.locals.randomChars(8);
          var path =  "./public/images/"+email+"/"
          if (!fs.existsSync(path)){
            fs.mkdirSync(path);
          }
          var pathProfile = path+ "profile/"
          if (!fs.existsSync(pathProfile)){
            fs.mkdirSync(pathProfile);
          }
          pathProfile += "profile.jpg"

          // Apply border to an Image
          lwip.open('./public/images/profile.jpg', function(err, image) {
            if (err) throw err;
              var _brdOpts = {
              width: 20,
              color: app.locals.randomImageBorderColor()
            }
            image.border(_brdOpts.width, _brdOpts.color, function(err, brdImg) {
              if (err) throw err;
              brdImg.writeFile('./public/images/profile_border.jpg', function(err) {
                if (err) {
                  fs.readFile("./public/images/profile.jpg", function(err, foto){
                    fs.writeFile(pathProfile, foto, function(error){
                    });  
                  });
                }else{

                  fs.readFile("./public/images/profile_border.jpg", function(err, foto){
                    fs.writeFile(pathProfile, foto, function(error){
                    });  
                  });
                }

                var pathCover = path+"cover/"
                if (!fs.existsSync(pathCover)){
                  fs.mkdirSync(pathCover);
                }
                pathCover += "cover.jpg"
                fs.readFile("./public/images/cover.jpg", function(err, foto){
                  fs.writeFile(pathCover, foto, function(error){
                  });  
                });
                var token = app.locals.createToken();
                var userModel = mongoose.model('User',app.locals.UserSchema);
                var userObj = new userModel({token: token, name: name, email: email, password: password});
                  userObj.save();
                  // console.log(userObj);
                  callback(token);
                  return ;

                });
            });
          });

          
        }
  });
}

app.locals.randomImageBorderColor = function(){
  return {r: app.locals.randomIntFromInterval(0,255),g: app.locals.randomIntFromInterval(0,255),
    b: app.locals.randomIntFromInterval(0,255),r: app.locals.randomIntFromInterval(0,100)};
}


app.locals.randomIntFromInterval = function(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}


app.locals.createToken = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

app.locals.removePost = function (idUser, idPost){
  mongoose.model('Post').findById(idPost,
    function(err, post){
      
      id_user_give_like = post.like;
      id_user_give_share = post.share;
      id_user_give_comment = new Array();

      if(post.title == null){//delete share handle shared_post
        mongoose.model('Post').findById(post.post_shared,
            function(err, sharedPost){
              if(sharedPost!=null){
                // post not yet deleted 
                index = sharedPost.share.indexOf(idUser);
                sharedPost.share.splice(index,1);
                sharedPost.id_unique_users = app.locals.removeUniqueObj(""+idUser, sharedPost.id_unique_users);
                sharedPost.post_index = app.locals.calculatePostIndex( sharedPost.share.length,  
                  sharedPost.like.length, sharedPost.comments.length );
                
                sharedPost.save();
              }
        });
      }

      for (var i = post.comments.length - 1; i >= 0; i--) {
        if(!app.locals.isObjectExist(id_user_give_comment,""+post.comments[i].creator))
          id_user_give_comment.push(""+post.comments[i].creator);
      };

      idUser = new Object(idUser);

      id_affected_user = new Object();
      id_affected_user = JSON.parse(JSON.stringify( id_user_give_like.concat(
        idUser,
        id_user_give_comment,
        id_user_give_share
        )));

      for (var i = id_affected_user.length - 1; i >= 0; i--) {
        if(app.locals.isObjectExist(id_affected_user.slice(0,i),id_affected_user[i]))
          id_affected_user.splice(i,1);
      };

      console.log("## id_affected_user "+id_affected_user);
      mongoose.model('User').find({_id: {$in: id_affected_user}},
        function(err, users){
          for (var i = users.length - 1; i >= 0; i--) {

            // remove unique object
            index = -1;
            for (var j = users[i].id_unique_posts.length - 1; index == -1 && j >= 0; j--) {
              if(idPost == users[i].id_unique_posts[j].id){
                index = j;
              }
            };
            if(index != -1) // if -1 then it is a post that is h=shared and nothing to do with the saved unique posts id
              users[i].id_unique_posts[index].remove();

            if(id_user_give_like.indexOf(users[i]._id) != -1){
              index = users[i].id_liked_posts.indexOf(idPost);
              users[i].id_liked_posts.splice(index,1);
            }

            if(app.locals.isObjectExist(id_user_give_comment,""+users[i]._id)){
              index = -1;
              for (var j = users[i].id_commented_posts.length - 1;index==-1 && j >= 0; j--) {
                if(idPost == users[i].id_commented_posts[j].id)
                  index = j;
              }
              users[i].id_commented_posts[index].remove();
            }

            if(id_user_give_share.indexOf(users[i]._id) != -1){
              index = users[i].id_share_posts.indexOf(idPost);
              users[i].id_share_posts.splice(index,1);
            }

            if(JSON.stringify(users[i]._id)==JSON.stringify(idUser)){
                if(post.title == null){
                  //delete share, handle this user
                  index = users[i].id_share_posts.indexOf(idPost);
                  users[i].id_share_posts.splice(index,1);
                }else{
                  index = users[i].id_user_posts.indexOf(idPost);
                  users[i].id_user_posts.splice(index,1);
                }
            }

            users[i].activeness = app.locals.calculateUserActiveness(users[i].id_user_posts.length, users[i].id_share_posts.length, 
              users[i].id_liked_posts.length, users[i].id_commented_posts.length, users[i].connections.length);
            
            users[i].save();
          };
          post.remove();
        });
  });
}

app.locals.isObjectExist = function (arrayObject, object){
  for (var i = arrayObject.length - 1; i >= 0; i--) {
    if(arrayObject[i] === object){
      return true;
    }
  };
  return false;
}

app.locals.givePost = function (idUser, content, title, keywords){
  var postModel = mongoose.model('Post',app.locals.PostSchema);
  var postObj = new postModel({creator: idUser, content: content, title: title, keywords: keywords});
  postObj.save();
  mongoose.model('User').findById(idUser, function(err, user){
    user.id_user_posts.push(postObj._id);
    user.activeness = app.locals.calculateUserActiveness(user.id_user_posts.length, user.id_share_posts.length, 
      user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
    user.id_unique_posts = app.locals.addUniqueObj(postObj._id, user.id_unique_posts);
    user.save();
    });
}

app.locals.giveShare = function (idUser, idPost, idOriginalCreator, content){
  mongoose.model('Post').findById(idPost,
    function(err, post){
    post.share.push(idUser);
    post.post_index = app.locals.calculatePostIndex( post.share.length,  
      post.like.length, post.comments.length );
    post.id_unique_users = app.locals.addUniqueObj(idUser, post.id_unique_users);
    post.save();

    var postModel = mongoose.model('Post',app.locals.PostSchema);
    var postObj = new postModel({creator: idUser, 
      content: content, post_shared: idPost, original_creator:idOriginalCreator});
    postObj.save();
    mongoose.model('User').findById(idUser)
    .exec(function(err, user){
      user.id_share_posts.push(postObj._id);
      user.id_unique_posts = app.locals.addUniqueObj(postObj._id, user.id_unique_posts);
      user.activeness = app.locals.calculateUserActiveness(user.id_user_posts.length, user.id_share_posts.length, 
        user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
      user.save();
    }); 
  });
}

app.locals.removeComment = function (idUser, idPost, idComment){
  mongoose.model('Post').findById(idPost,
    function(err, post){
      index = -1;
        for(var i = 0; i < post.comments.length && index== -1; i++) {
         if(post.comments[i]._id == idComment) {
           index =  i;
         }
      }
      post.comments.splice(index, 1);
      post.post_index = app.locals.calculatePostIndex( post.share.length,  
        post.like.length, post.comments.length );
      post.id_unique_users = app.locals.removeUniqueObj(idUser, post.id_unique_users);
      post.save();

      mongoose.model('User').findById(idUser)
        .exec(function(err, user){          
          user.id_commented_posts = app.locals.removeUniqueObj(idPost,user.id_commented_posts)
          user.activeness = app.locals.calculateUserActiveness(user.id_user_posts.length, user.id_share_posts.length, 
            user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
          user.id_unique_posts = app.locals.removeUniqueObj(idPost, user.id_unique_posts);
          user.save();              
      }); 
  });
}

app.locals.addContact = function(idUser, idPeople, callback){
  mongoose.model('User').findById(idPeople, function(err, userA){
    if(err){
      console.log(err);
      callback ("404"); 
    }else{
      mongoose.model('User').findById( idUser, function(err, userB){
        index = userA.connections.indexOf(userB._id);
        if(index == -1){
          userA.connections.push(idUser);  
          userA.activeness = app.locals.calculateUserActiveness(userA.id_user_posts.length, userA.id_share_posts.length, 
            userA.id_liked_posts.length, userA.id_commented_posts.length, userA.connections.length);
          userA.save();

          userB.connections.push(idPeople);
          userB.activeness = app.locals.calculateUserActiveness(userB.id_user_posts.length, userB.id_share_posts.length, 
            userB.id_liked_posts.length, userB.id_commented_posts.length, userB.connections.length);
          userB.save();
          console.log("success");
          callback("success");
        }else{
          console.log("already friend");
          callback("already friend");
        }
      });
    }
    return;
  });
}

app.locals.giveComment = function(idUser, idPost, content){
  mongoose.model('Post').findById(idPost,
    function(err, post){
      objComment = new Object();
        objComment.content = content;
        objComment.creator = idUser;
      post.comments.push(objComment);
      post.post_index = app.locals.calculatePostIndex( post.share.length,  
        post.like.length, post.comments.length );
      post.id_unique_users = app.locals.addUniqueObj(idUser, post.id_unique_users);
      post.save();

      mongoose.model('User').findById(idUser)
        .exec(function(err, user){
          user.id_commented_posts = app.locals.addUniqueObj(idPost,user.id_commented_posts)
          user.id_unique_posts = app.locals.addUniqueObj(idPost, user.id_unique_posts);
          user.activeness = app.locals.calculateUserActiveness(user.id_user_posts.length, user.id_share_posts.length, 
            user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
          user.save();              
      }); 
  });
}

app.locals.giveLike = function(idUser, idPost){
  // console.log("SSSSSSSSSSSSSSSSSSSSSS")
  mongoose.model('Post').findById(idPost,
    function(err, post){
    post.like.push(idUser);
    post.post_index = app.locals.calculatePostIndex( post.share.length,  
      post.like.length, post.comments.length );
    post.id_unique_users = app.locals.addUniqueObj(idUser, post.id_unique_users);
    post.save();

    mongoose.model('User').findById(idUser)
      .exec(function(err, user){
        user.id_liked_posts.push(idPost);
        user.id_unique_posts = app.locals.addUniqueObj(idPost, user.id_unique_posts);
        user.activeness = app.locals.calculateUserActiveness(user.id_user_posts.length, user.id_share_posts.length, 
            user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
        user.save();          
        return "like";
        
    }); 
  });
}

app.locals.addUniqueObj = function(idObj, arrayUniqueObj){
  index = -1;
  for (var i = arrayUniqueObj.length - 1; index == -1 && i >= 0; i--) {
    if(idObj == arrayUniqueObj[i].id){
      index = i;
    }
  };
  if(index == -1){
    newObj = new Object();
      newObj.id = idObj;
      newObj.num = 1;
    arrayUniqueObj.push(newObj);
  }else{
    arrayUniqueObj[index].num++;
  }

  return arrayUniqueObj;
}

app.locals.removeUniqueObj = function(idObj, arrayUniqueObj){
  index = -1;
  for (var i = arrayUniqueObj.length - 1; index == -1 && i >= 0; i--) {
    if(idObj == arrayUniqueObj[i].id){
      index = i;
    }
  };
  
  if(index == -1){
    console.log(idObj+" ERORRRRRRRRRRRRRRRRRRRRRRRR!!!!! "+index+" ====================== "+arrayUniqueObj);
  }else{
    arrayUniqueObj[index].num--;
  }

  if(arrayUniqueObj[index].num == 0)
    arrayUniqueObj.splice(index, 1);

  return arrayUniqueObj;
}

app.locals.removeLike = function(idUser, idPost){
  mongoose.model('Post').findById(idPost,
    function(err, post){
    index = post.like.indexOf(idUser);
    post.like.splice(index,1);
    post.post_index = app.locals.calculatePostIndex( post.share.length,  
      post.like.length, post.comments.length );
    post.id_unique_users = app.locals.removeUniqueObj(idUser, post.id_unique_users);
    post.save();

    mongoose.model('User').findById(idUser)
      .exec(function(err, user){
        indexPost = user.id_liked_posts.indexOf(idPost);
        user.id_liked_posts.splice(indexPost,1);
        user.id_unique_posts = app.locals.removeUniqueObj(idPost, user.id_unique_posts);
        user.activeness = app.locals.calculateUserActiveness(user.id_user_posts.length, user.id_share_posts.length, 
            user.id_liked_posts.length, user.id_commented_posts.length, user.connections.length);
        user.save();
        return "dislike";
    }); 
  });
}

app.locals.calculateUserActiveness = function(numOfPost, numOfShare, numOfLike, numOfComment, numOfConnections){
  return ((numOfPost* 20)+(numOfShare* 8)+(numOfLike* 3)+(numOfComment* 5)+numOfConnections);
}

app.locals.calculatePostIndex = function(numOfShare, numOfLike, numOfComment){
  return ((numOfShare* 3)+(numOfLike* 1)+(numOfComment* 2));
}

module.exports = app;
