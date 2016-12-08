var express = require('express');
var router = express.Router();

var setting_cont = require('../controller/base/setting_cont');

/* POST Change UI */
router.post('/setAppearancePopularPost', function(req, res, next) {
	if(req.session.setting.show_popular_post!=null){	// res.send("post")
		console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
		if(req.session.setting.show_popular_post){
			req.session.setting.show_popular_post = false;
			res.send({'show_popular_post': false});
		}
		else{
			req.session.setting.show_popular_post = true;
			res.send({'show_popular_post': true});
		}
	}else{
		res.redirect('/login');
	}
});

/* POST Change UI */
router.post('/setAppearanceReccPost', function(req, res, next) {
		console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
	if(req.session.setting.show_recc_post!=null){	// res.send("post")
		if(req.session.setting.show_recc_post){
			req.session.setting.show_recc_post = false;
			res.send({'show_recc_post': false});
		}else{
			req.session.setting.show_recc_post = true;
			res.send({'show_recc_post': true});
		}
	}else{
		res.redirect('/login');
	}
});

module.exports = router;
