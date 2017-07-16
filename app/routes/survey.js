var express = require('express');
var router = express.Router();
//var socket = io();

router.get('/survey', function(req, res) {
	res.render('survey', {
	});
	
});

module.exports = router;