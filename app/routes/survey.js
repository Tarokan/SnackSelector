var express = require('express');
var router = express.Router();
//var socket = io();

router.get('/survey', function(req, res) {
	var set = 1;
//	socket.emit('questionload', 1);
	res.render('survey', {
	});
	
});

module.exports = router;