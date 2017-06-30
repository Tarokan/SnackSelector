var socket = io();
var round = 0;
//var dataFile = require('./data/1.json');

//var options = dataFile.calories;

var $optionList = $('.options');


//var $copy = $optionList.find('a:first');
//$optionList.append("  <a href='#' class='list-group-item list-group-item-action'><span class='badge'><span class='glyphicon glyphicon-ok-circle' aria-hidden='true'></span></span>" + options[0] + "Dapibus ac facilisis in</a>");

socket.on('updateQuestion', function(data) {
	
console.log(data.calories);
	for(i = 0; i < data.calories.length; i++) {
		$optionList.append("<a href='#' class='list-group-item list-group-item-	action'><span class='badge'><span class='glyphicon glyphicon-ok-circle' aria-	hidden='true'></span></span>" + data.calories[i] + "</a>")
	}
});

$('.options').on('click', function(e) {
	var optionNumber = e.target.id.charAt(6);
	console.log(optionNumber);
	socket.emit('clicked', optionNumber);
	round++;
});