var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new mongoose.Schema({
  group_name: String,
  group_info: String,
  group_accessibility: String,
  group_admin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  group_members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  courses_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' , default: []}],
  img_cover_name: {type: String, default: "group_cover.jpg"},
  group_posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
});
mongoose.model('Group',GroupSchema);

module.exports = { 
  model : mongoose.model('Group', GroupSchema),
  object: mongoose.model('Group')
}