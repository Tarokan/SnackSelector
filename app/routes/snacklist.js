var express = require('express');
var router = express.Router();

router.get('/snacklist', function(req, res) {
	//var data = req.app.get('questionData')
	
	res.render('index', {
		pageID: 'snacklist'
	});
	
});

module.exports = router;