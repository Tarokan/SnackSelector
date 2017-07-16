var socket = io();

var $optionList = $('.options');
var $categorySelector = $("#categorySelector");

var singleFlag = true;
var ready = false;
var flags = [];

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
	$("#questionDescription").text(data.description);
	$categorySelector.append("<li><a href='#'>" + data.name + "</a></li>")
	for(i = 0; i < data.options.length; i++) {
		$optionList.append("<a href='#' class='list-group-item list-group-item-	action' id=" + "option" + i + "><span class='badge'></span>" + data.options[i] + "</a>")
	}
	singleFlag = true;
	if(data.type == "multiple") {
		$(".options").after("<div class='text-right'><button type='button' class='btn btn-lg btn-primary' id='multipleSubmitter'>Next</button></div>");
		singleFlag = false;
		
		$('#multipleSubmitter').click(function() {
			socket.emit('clicked', flags);
			console.log("submitted");
		});
	}
	ready = true;
	
}

$('.options').on('click', function(e) {
	if(ready) {
		ready = false;
	var optionNumber = parseInt(e.target.id.charAt(6));
	    e.preventDefault();
	if(singleFlag) {
		$(e.target).addClass("list-group-item-success");
		$(e.target).find(".badge").html("<span class='glyphicon glyphicon-ok-circle' aria-	hidden='true'></span>");
		socket.emit('clicked', optionNumber);
	} else {
		$(e.target).toggleClass("active");
		checkOptions();
		if(flags.length > 0) {
			$(".btn-lg").removeClass("btn-primary").addClass("btn-success");
		} else {
			$(".btn-lg").removeClass("btn-success").addClass("btn-primary");
		}
	}
	}
});



function checkOptions() {
	flags = [];
	$(".list-group-item").each(function(item) {
		if($(this).hasClass("active")) {
			flags.push(item);
		}
	});
	console.log(flags);
}
