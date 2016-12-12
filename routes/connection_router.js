var express = require('express');
var router = express.Router();

/*Controller*/
var connection_cont = require('../controller/base/connection_cont');

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
	
/* GET friends page. */
router.get('/:id/:search_term/:page/:limit', function(req, res, next) {
	if(req.session.profile!=null){
		console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
		connection_cont.fullSearchWithinConnection(req, res, req.params.id, req.params.search_term, req.params.page, req.params.limit, true);
	}else{
		res.redirect('/login');
	}
});

router.post('/searchNewConnection', function(req, res, next) {
	if(req.session.profile!=null){
		connection_cont.searchNewConnection(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});
	
router.post('/quickSearchWithinConnection', function(req, res, next) {
	if(req.session.profile!=null){
		connection_cont.quickSearchWithinConnection(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});

router.post('/quickSearchNewMemberGroup', function(req, res, next) {
	if(req.session.profile!=null){
		connection_cont.quickSearchNewMemberGroup(req, function(result){
			res.send(result);
		});
	}else{
		res.redirect('/login');
	}
});
module.exports = router;
