var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dummyAbout = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

var UserSchema = new mongoose.Schema({
  token : String,
  name: String,
  date_created: { type: Date, default: Date.now},
  email: String,
  online_connection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  password: String,
  education:  { type: String, default: "Institut Teknologi Bandung"},
  about : { type: String, default: dummyAbout},
  occupation: { type: String, default: "Student"},
  social_networks:[{
      name: { type: String, default: "facebook"}, 
      url: { type: String, default: "https://www.facebook.com/daniar.h.kurniawan" }
    }],
  connections:{type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: []},
  groups:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  img_profile_name: {type: String, default: "profile.jpg"},
  img_cover_name: {type: String, default: "cover.jpg"},
  chat:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  id_user_posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

  id_liked_posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], 
  id_share_posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], 
  id_commented_posts: [{ 
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},             
      num: {type: Number, default: 1}                                      // 60 posts unique -> ambil 10 yg post_index paling tinggi (default) ->    300 id user unique-> ternyata 250 orang sudah berteman-> tinggal 50-> orang" yg melakukan action terhadap 60 post tsb -> dapat list id user misal 200 user -> ( di sort berdasarkan user activeness) ambil default merekomendasikann 20 orang 
    }],
  id_unique_posts: [{ 
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},             
      num: {type: Number, default: 1}                                      // 60 posts unique -> ambil 10 yg post_index paling tinggi (default) ->    300 id user unique-> ternyata 250 orang sudah berteman-> tinggal 50-> orang" yg melakukan action terhadap 60 post tsb -> dapat list id user misal 200 user -> ( di sort berdasarkan user activeness) ambil default merekomendasikann 20 orang 
    }], // according to shared / liked / commented posts
  
  activeness: {type: Number, default: 1}
});     
mongoose.model('User',UserSchema);

module.exports = { 
  model : mongoose.model('User', UserSchema),
  object: mongoose.model('User')
}