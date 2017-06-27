var express = require('express');
var router = express.Router();
//var socket = io();

router.get('/survey', function(req, res) {
	var options = req.app.get('surveyData').calories;
	var set = 1;
//	socket.emit('questionload', 1);
	res.render('survey', {
		 options: options
	});
	
});

module.exports = router;