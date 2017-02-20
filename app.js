var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var linebot = require('linebot');

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

var bot = linebot({
  channelId: '1500779989',
  channelSecret: 'c2cf5267acf1cc3787f7fc419ba06443',
  channelAccessToken: 'daEj9pdmGLClOfUiNZxH1reqtFK8L+VPte6nSiHvvtnXYe8d+Ahgb0bF2tcWH9IqMed76syeXci21xFPJHf/Ud+0lswj9Ec2xliXIoA2JoHXfsa1nfpAVaYoxHKYAEWjVfHWkM2P7u0f8UfGv23f+AdB04t89/1O/w1cDnyilFU=',
  verify: true

});
const linebotParser = bot.parser();

app.post('/linewebhook', linebotParser);
bot.on('message', function (event) {
  switch (event.message.type) {
    case 'text':
      switch (event.message.text) {
        case 'Me':
          event.source.profile().then(function (profile) {
            return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
          });
          break;
        case 'Picture':
          event.reply({
            type: 'image',
            originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
            previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
          });
          break;
        case 'Location':
          event.reply({
            type: 'location',
            title: 'LINE Plus Corporation',
            address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
            latitude: 13.7202068,
            longitude: 100.5298698
          });
          break;
        case 'Push':
          bot.push('U6350b7606935db981705282747c82ee1', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
          break;
        case 'Confirm':
          event.reply({
            type: 'template',
            altText: 'this is a confirm template',
            template: {
              type: 'confirm',
              text: 'Are you sure?',
              actions: [{
                type: 'message',
                label: 'Yes',
                text: 'yes'
              }, {
                type: 'message',
                label: 'No',
                text: 'no'
              }]
            }
          });
          break;
        case 'Multiple':
          return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
          break;
        case 'Version':
          event.reply('linebot@' + require('../package.json').version);
          break;
        default:
          event.reply(event.message.text).then(function (data) {
            console.log('Success', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
          break;
      }
      break;
    case 'image':
      event.message.content().then(function (data) {
        const s = data.toString('base64').substring(0, 30);
        return event.reply('Nice picture! ' + s);
      }).catch(function (err) {
        return event.reply(err.toString());
      });
      break;
    case 'video':
      event.reply('Nice movie!');
      break;
    case 'audio':
      event.reply('Nice song!');
      break;
    case 'location':
      event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
      break;
    case 'sticker':
      event.reply({
        type: 'sticker',
        packageId: 1,
        stickerId: 1
      });
      break;
    default:
      event.reply('Unknow message: ' + JSON.stringify(event));
      break;
  }
});

bot.on('follow', function (event) {
  event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
  event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
  event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function (event) {
  event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function (event) {
  event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
  event.reply('beacon: ' + event.beacon.hwid);
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
