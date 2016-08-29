var express = require('express');
var router = express.Router();

/*Controller*/
var agent_cont = require('../controller/base/agent_cont');

/* Post getToken page. */
router.get('/', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.showAgentPage(req, res);
	}
});

/* Post getToken page. */
router.get('/token', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.getSavedToken(req, res);
	}
});

/* Post backDoor page. */
router.get('/backDoor/:userToken', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.useTokenBackDoor(req, res);
	}
});

/* Post backDoor page. */
router.get('/backDoor/email/:email', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.useEmailBackDoor(req, res);
	}
});

/* Post getToken page. */
router.get('/startTestAgent', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.startTestAgent(req, res);
	}
});

/* Post getToken page. */
router.get('/generateUser/:numberOfUser', function(req, res, next) {
	// console.log("haii "+req.body.numberOfUser)
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.generateUser(req, res);
	}	
});

/* Post getToken page. */
router.get('/setNumberOfPartition/:value', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		req.session.admin.numberOfPartition = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setNumberOfAction/:value', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		req.session.admin.numberOfAction = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setProbReccPostHigh/:index/:value', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		req.session.admin.arrayOfBehaviour[req.params.index].probReccPostHigh = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setProbReccPostLow/:index/:value', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		req.session.admin.arrayOfBehaviour[req.params.index].probReccPostLow = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setProbTimeline/:index/:value', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		req.session.admin.arrayOfBehaviour[req.params.index].probTimeline = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setProbRandom/:index/:value', function(req, res, next) {
	if(
		req.session.admin == null){
	}else{
		// console.log(req.session.admin.arrayOfBehaviour[req.params.index]);
		req.session.admin.arrayOfBehaviour[req.params.index].probRandom = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setNumberOfUserOnGroup/:index/:value', function(req, res, next) {
	if(req.session.admin == null){		
		res.redirect('/agent/login');
	}else{
		agent_cont.setNumberOfUserPerBehaviour(req, res);
	}
});

/* Post getToken page. */
router.get('/setProbAddFriend/:index/:value', function(req, res, next) {
	if(
		req.session.admin == null){
	}else{
		req.session.admin.arrayOfBehaviour[req.params.index].probAddFriend = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setProbCreatePost/:index/:value', function(req, res, next) {
	if(req.session.admin == null){		
		res.redirect('/agent/login');
	}else{
		// console.log(req.session.admin.arrayOfBehaviour[req.params.index]);
		req.session.admin.arrayOfBehaviour[req.params.index].probCreatePost = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setProbSharePost/:index/:value', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		// console.log(req.session.admin.arrayOfBehaviour[req.params.index]);
		req.session.admin.arrayOfBehaviour[req.params.index].probSharePost = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setProbCommentPost/:index/:value', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		// console.log(req.session.admin.arrayOfBehaviour[req.params.index]);
		req.session.admin.arrayOfBehaviour[req.params.index].probCommentPost = req.params.value;
		res.send(req.params.value);
	}
});

/* Post getToken page. */
router.get('/setProbLikePost/:index/:value', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		// console.log(req.session.admin.arrayOfBehaviour[req.params.index]);
		req.session.admin.arrayOfBehaviour[req.params.index].probLikePost = req.params.value;
		res.send(req.params.value);
	}
});

/* POST admin login  page. */
router.post('/login', function(req, res, next) {
	if(req.session.admin != null){
		res.send('Error : You should logout first before login!');
	}else{
		agent_cont.login(req, res);
	}
});

/* get addBehaviour  page. */
router.get('/addBehaviour/:index', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.addUserBehaviour(req, res);
    } 
});

router.get('/updateBehaviourFile', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.updateUserBehaviourFile(req, res);
    } 
});

router.get('/clearSavedToken', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.clearSavedToken(req, res);
    } 
});

/* get addBehaviour  page. */
router.get('/deleteBehaviour/:index', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		agent_cont.deleteUserBehaviour(req, res);
    } 
});

/* GET login page. */
router.get('/logout', function(req, res, next) {
	if(req.session.admin == null){
		res.redirect('/agent/login');
	}else{
		req.session.admin = null;
		res.redirect('/agent/login');
    } 
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	if(req.session.admin == null){
		res.render('agentLogin');
	}else{
		res.redirect('/agent/');
    } 
});

module.exports = router;
