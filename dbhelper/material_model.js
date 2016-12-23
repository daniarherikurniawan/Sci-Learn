var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MaterialSchema = new mongoose.Schema({
    is_video: {type: Boolean, default: false},
    is_announcement: {type: Boolean, default: false},
    is_file: {type: Boolean, default: false},
    is_locked: {type: Boolean, default: false},
    is_quiz: {type: Boolean, default: false},
    is_done: {type: Boolean, default: false},
    has_url: {type: Boolean, default: false},
    required_material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
    material_type: {type: String, default: "video"}, /*announcement, video, file, quiz, lock*/ 
    material_title: {type: String, default: "Fill out with material title!"},
    material_description: {type: String, default: "Fill out with material description!"},
    material_url: {type: String, default: "Fill out with material url!"}
});
mongoose.model('Material',MaterialSchema);

module.exports = { 
  model : mongoose.model('Material', MaterialSchema),
  object: mongoose.model('Material')
}
