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

socket.on('waitForResult', function(data) {
	$(".surveycontent").children().remove();
	console.log("waiting for Results");
});

socket.on('results', function(data) {
	console.log("results received" + data.first.toString());
	$('.surveycontent').load("resultcontainer.html", function() {

		$("#firstResultPic").append("<img src='images/" + data.first.pictureLink + "' class='img-circle img-responsive' alt='Top Result Image'>");
		$("#firstResultText")
			.append("<h2> <span style='color:#222222'> Best Match: </span><b>" 
							+ data.first.name + "</b> (" + data.first.manufacturer + ")</h2>"
						 + "<h3>Type: " + data.first.type + "</h3><h4>" + data.first.description + "</h4>")
		  .append('<a href="' + data.first.amazonLink + '" target="_blank" class="btn btn-info"  role="button">Shop on Amazon<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>	</a>');
		$("#firstResultText").addClass("vcenter");
	});
	
});

function updateQuestions(data) {
	$(".list-group-item").remove();
	$("#questionDescription").text(data.description);
	$categorySelector.append("<li><a href='#' class='breadcrumblink'>" + data.name + "</a></li>")
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
		var optionNumber = parseInt(e.target.id.charAt(6));
	  e.preventDefault();
			if(singleFlag) {
				ready = false;
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
