var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new mongoose.Schema({
  name: String,
  group_posts: [{
    content: String, 
    title: String,
    keywords: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    like:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    share: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    post_index: {type:Number, default: 1},
    date_created: { type: Date, default: Date.now}
  }]
});
mongoose.model('Group',GroupSchema);

module.exports = { 
  model : mongoose.model('Group', GroupSchema),
  object: mongoose.model('Group')
}