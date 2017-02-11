var express = require('express');
var router = express.Router();

/* POST Change UI */
router.get('/', function(req, res, next) {
	res.send("holla");
});
/* POST Change UI */

module.exports = router;
