var express = require('express');
var router = express.Router();
var LINEBot = require('line-messaging');

var line_cont = require('../controller/base/line_cont');

var bot = LINEBot.create({
  channelID: '1500779989',
  channelSecret: 'c2cf5267acf1cc3787f7fc419ba06443',
  channelToken: 'daEj9pdmGLClOfUiNZxH1reqtFK8L+VPte6nSiHvvtnXYe8d+Ahgb0bF2tcWH9IqMed76syeXci21xFPJHf/Ud+0lswj9Ec2xliXIoA2JoHXfsa1nfpAVaYoxHKYAEWjVfHWkM2P7u0f8UfGv23f+AdB04t89/1O/w1cDnyilFU='
});
bot.webhook('/webhook');
bot.on(LINEBot.Events.MESSAGE, function(replyToken, message) {
  var textMessageBuilder = new LINEBot.TextMessageBuilder('hello');
	bot.replyMessage(replyToken, textMessageBuilder);
});

/* POST Change UI */
router.get('/', function(req, res, next) {
	res.send("holla");
});

module.exports = router;
