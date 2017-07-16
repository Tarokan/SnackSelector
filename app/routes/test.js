var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

router.get('/test', function(req, res) {
	url = "";
	
	var itemName;
	request(url, function(error, response, html) {
		if(!error) {
			console.log(html);
			var $ = cheerio.load(html);
			
			$('.Price-characteristic').filter(function() {
				var data = $(this).attr("aria-label");
				console.log("data pulled" + data);
				itemName = data;
			})
			
			console.log("the name of the item is" + itemName);
		}
	})
	res.render('test', {
		pageID: 'test',
		textData: itemName
	});
	
});

module.exports = router;