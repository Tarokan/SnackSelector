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

socket.on('results', function(topFive) {
	console.log("results received" + topFive.data[0].toString());
	$('.surveycontent').load("resultcontainer.html", function() {

		//first result
		$("#firstResultPic").append("<img src='images/" + topFive.data[0].pictureLink + "' class='img-circle img-responsive' alt='Top Result Image'>");
		$("#firstResultText")
			.append("<h2><b>" 
							+ topFive.data[0].name + "</b> (" + topFive.data[0].manufacturer + ")</h2>"
						 + "<h3>Type: " + topFive.data[0].type + "</h3><h4>" + topFive.data[0].description + "</h4>")
		  .append('<a href="' + topFive.data[0].amazonLink + '" target="_blank" class="btn btn-info"  role="button">Shop on Amazon<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>	</a>');
		
		//second result
		$("#secondResultPic").append("<img src='images/" + topFive.data[1].pictureLink + "' class='img-circle img-responsive' alt='Top Result Image'>");
		$("#secondResultText")
			.append("<h2> <b>" 
							+ topFive.data[1].name + "</b> (" + topFive.data[1].manufacturer + ")</h2>"
						 + "<h3>Type: " + topFive.data[1].type + "</h3><h4>" + topFive.data[1].description + "</h4>")
		  .append('<a href="' + topFive.data[1].amazonLink + '" target="_blank" class="btn btn-info"  role="button">Shop on Amazon<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>	</a>');
		
		$("#showMoreButton").on('click', function(e) {
			event.preventDefault();
			$("#showMoreButton").hide();
			$("#other-results").load("defaultcontainer.html", function() {
			var copyOfElement = $("#other-results").html()
			$("#other-results").append(copyOfElement).append(copyOfElement);
				
				for(i = 0; i < 3; i++) {
					$(".snack-list-item > .snack-picture:eq(" + i + ")").append("<img src='images/" + topFive.data[i+2].pictureLink + "' class='img-circle img-responsive' alt='Result Image'>")
					$(".snack-list-item > .snack-text:eq(" + i + ")").append("<h2> <b>" 
							+ topFive.data[i+2].name + "</b> (" + topFive.data[i+2].manufacturer + ")</h2>"
						 + "<h3>Type: " + topFive.data[i+2].type + "</h3><h4>" + topFive.data[i+2].description + "</h4>")
		  .append('<a href="' + topFive.data[i+2].amazonLink + '" target="_blank" class="btn btn-info"  role="button">Shop on Amazon<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>	</a>');
				}
		});
		});

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
