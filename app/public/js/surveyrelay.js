var socket = io();
var round = 0;

var $optionList = $('.options');
var $categorySelector = $("#categorySelector");

socket.on('setQuestions', function(data) {
	
	updateQuestions(data);
	
});

socket.on('changeQuestions', function(data) {
	setTimeout(function() {
		updateQuestions(data);
	}, 1000);
});

function updateQuestions(data) {
	$(".list-group-item").remove();
	console.log(data.name);
	$categorySelector.append("<li><a href='#'>" + data.name + "</a></li>")
	for(i = 0; i < data.options.length; i++) {
		$optionList.append("<a href='#' class='list-group-item list-group-item-	action' id=" + "option" + i + "><span class='badge'></span>" + data.options[i] + "</a>")
	}

}

$('.options').on('click', function(e) {
	var optionNumber = parseInt(e.target.id.charAt(6));
	$(e.target).addClass("list-group-item-success")
	$(e.target).find(".badge").html("<span class='glyphicon glyphicon-ok-circle' aria-	hidden='true'></span>");
	socket.emit('clicked', optionNumber);
	round++;
});