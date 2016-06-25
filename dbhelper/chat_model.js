var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new mongoose.Schema({
  userA:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userB:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_updated: { type: Date, default: Date.now},
  content: [{text: String, creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }}]
});
mongoose.model('Chat',ChatSchema);

module.exports = { 
  model : mongoose.model('Chat', ChatSchema),
  object: mongoose.model('Chat')
}