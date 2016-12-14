var Post = require('../../../dbhelper/post_model');
var User = require('../../../dbhelper/user_model');

module.exports = { 
  getPostIdForHome: function(idForPostCreator, limit, 
    numOfCurrPage, icludeSharingPost, callback){
    firstIndex = limit*numOfCurrPage;
    if(limit != 0){ // for home page
      User.object.find({ '_id' : {$in :idForPostCreator}})
        .populate ({
            path: 'online_connection',
            select: 'id_user_posts id_share_posts'} )
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
      User.object.find({ '_id' : {$in :idForPostCreator}})
        .populate ({
            path: 'online_connection',
            select: 'id_user_posts id_share_posts'} )
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
}
