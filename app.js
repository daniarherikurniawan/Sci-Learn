var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var LINEBot = require('line-messaging');

/*databases connection*/
var mongo = require('./dbconfig/mongo_config');
mongo.connect();

var app = express();
app.version = "[ v_0.9.5 ]";
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
var group = require('./routes/group_router');  
var connection = require('./routes/connection_router');
var setting = require('./routes/setting_router');
var course = require('./routes/course_router');
var bookmark = require('./routes/bookmark_router');
var auth = require('./routes/auth_router');
var line = require('./routes/line_router');

app.use('/', index);
app.use('/agent', agent);
app.use('/group', group);
app.use('/API', api);
app.use('/profile', profile);
app.use('/connections', connection);
app.use('/user', user);
app.use('/setting', setting);
app.use('/course', course);
app.use('/line', line);

// GLOBAL VARIABLE
global.response = require('./controller/base/response_cont');


var bot = LINEBot.create({
  channelID: '1500779989',
  channelSecret: 'c2cf5267acf1cc3787f7fc419ba06443',
  channelToken: 'daEj9pdmGLClOfUiNZxH1reqtFK8L+VPte6nSiHvvtnXYe8d+Ahgb0bF2tcWH9IqMed76syeXci21xFPJHf/Ud+0lswj9Ec2xliXIoA2JoHXfsa1nfpAVaYoxHKYAEWjVfHWkM2P7u0f8UfGv23f+AdB04t89/1O/w1cDnyilFU='
});

app.use(bot.webhook('/webhook'));

bot.on(LINEBot.Events.MESSAGE, function(replyToken, message) {
  console.log("Masukkk!")
  var textMessageBuilder = new LINEBot.TextMessageBuilder('hello');
  bot.replyMessage(replyToken, textMessageBuilder);
});


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
app.use(
  function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
}
);

module.exports = app;
