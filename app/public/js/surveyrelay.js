var socket = io();
var round = 0;

var options = req.app.get('surveyData').calories;

console.log(options.toString()+ "hi");


var $optionList = $('.options');
//var $copy = $optionList.find('a:first');
//$optionList.append("  <a href='#' class='list-group-item list-group-item-action'><span class='badge'><span class='glyphicon glyphicon-ok-circle' aria-hidden='true'></span></span>" + options[0] + "Dapibus ac facilisis in</a>");

$('.options').on('click', function(e) {
	var optionNumber = e.target.id.charAt(6);
	console.log(optionNumber);
	socket.emit('clicked an option', optionNumber);
	round++;
});