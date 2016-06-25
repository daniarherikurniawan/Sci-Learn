var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
  creator:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_created: { type: Date, default: Date.now},
  content: String,
  title: String,
  keywords: String,

  liked: { type: Boolean, default: false},
  shared: { type: Boolean, default: false},
  ui: { index: {type:Number, default: 1}, 
    status : { type: String, default: "active"}},

  like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  share: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ content: String, 
    date_created: { type: Date, default: Date.now},
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    liked : { type: Boolean, default: false},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  id_unique_users: [{ 
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},             
      num: {type: Number, default: 1}                                      // 60 posts unique -> ambil 10 yg post_index paling tinggi (default) ->    300 id user unique-> ternyata 250 orang sudah berteman-> tinggal 50-> orang" yg melakukan action terhadap 60 post tsb -> dapat list id user misal 200 user -> ( di sort berdasarkan user activeness) ambil default merekomendasikann 20 orang 
    }],
    
  post_shared: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  original_creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post_index: {type:Number, default: 0}
});
mongoose.model('Post',PostSchema);

module.exports = { 
  model : mongoose.model('Post', PostSchema),
  object: mongoose.model('Post')
}