var express = require('express');
var router = express.Router();

/*Controller*/
var connection_cont = require('../controller/connection_cont');

/* GET friends page. */
router.get('/:id', function(req, res, next) {
	if(req.session.profile!=null){
		connection_cont.showConnectionsPage(req, res, req.params.id, 0, 15, false);
	}else{
		res.redirect('/login');
	}
});


/* GET friends page. */
router.get('/:id/:page', function(req, res, next) {
	if(req.session.profile!=null){
		connection_cont.showConnectionsPage(req, res, req.params.id, req.params.page, 15, false);
	}else{
		res.redirect('/login');
	}
});

/* GET friends page. */
router.get('/:id/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){
		// console.log("limiiiit")
		connection_cont.showConnectionsPage(req, res, req.params.id, req.params.page, req.params.limit, true);
	}else{
		res.redirect('/login');
	}
});

module.exports = router;
