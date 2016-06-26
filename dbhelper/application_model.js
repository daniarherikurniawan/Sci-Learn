var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new mongoose.Schema({
  username:  String,
  password: String
});
mongoose.model('Application',ApplicationSchema);

module.exports = { 
  model : mongoose.model('Application', ApplicationSchema),
  object: mongoose.model('Application')
}