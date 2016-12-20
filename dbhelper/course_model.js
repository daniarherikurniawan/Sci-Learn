var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new mongoose.Schema({
  course_name: String,
  course_info: String,
  course_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  course_instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  course_materials: { type: [{
    content: String, 
    title: String,
    keywords: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    like:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    share: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    post_index: {type:Number, default: 1},
    date_created: { type: Date, default: Date.now}
  }], default: []},

  date_created: { type: Date, default: Date.now},
  img_cover_name: {type: String, default: "course_cover.jpg"},
  course_accessibility: String,

  course_tasks: { type: [{
    content: String, 
    title: String,
    keywords: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    like:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    share: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    post_index: {type:Number, default: 1},
    date_created: { type: Date, default: Date.now}
  }], default: []}
});
mongoose.model('Course',CourseSchema);

module.exports = { 
  model : mongoose.model('Course', CourseSchema),
  object: mongoose.model('Course')
}