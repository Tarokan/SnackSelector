var express = require('express');
var reload = require('reload');
var app = express();
var fs = require('fs');
var io = require('socket.io')();

app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/survey'));
app.use(require('./routes/test'));

app.locals.siteTitle = 'Snack Selector';
const snackDataPath = __dirname + '/data/snacks.json';
var snackDataJson;

//dictate number of questions
var surveyTotal = 4;

var questionRaw = fs.readFileSync(__dirname + '/data/questions.json');
var questionData = JSON.parse(questionRaw);

var server = app.listen(app.get('port'), function() {
  console.log('Listening on ports: ' + app.get('port'));
});

initializeData();
console.log(snackDataJson);
io.attach(server);

io.on('connection', function(socket) {
	var date = new Date();
  console.log(date+' : a user connected '+socket.id);
	
	//path to json file of user
	var userPath = __dirname + '/data/' + socket.id + '.json';
	
	//survey blank template
	var template = {
		"current" : 0,
		"data"	: {
			
		}
	};
	var jsondata = JSON.stringify(template);
	fs.writeFileSync(userPath, jsondata, 'utf8');
	
	var questionContent = getQuestions(userPath, 0);
	io.emit('setQuestions', questionContent);
	
	
	socket.on('disconnect', function(){
		fs.unlinkSync(__dirname + '/data/' + socket.id + '.json');
    console.log('user disconnected');
  });
	
	socket.on('clicked', function(data) {
		console.log(socket.id + ' clicked option' + data);
		if(writeAnswer(userPath, data)) {
			console.log(socket.id + ' finished the survey');
			// find stuff
			io.emit('waitForResult')
			var results = analyze(userPath);
			io.emit('results', results);
		}
	});
	
});

function getQuestions(path, number) {
	return (questionData.questionSets[number]);
}

function writeAnswer(path, data) {
		var contents = fs.readFileSync(path);
		var jsonContent = JSON.parse(contents);
	
		var name = questionData.questionSets[jsonContent.current].name;
	
		jsonContent.data[name] = data;
		jsonContent.current = jsonContent.current + 1;
		fs.writeFileSync(path, JSON.stringify(jsonContent), 'utf8');
		if(jsonContent.current == surveyTotal) {
			return true;
		}
		var newQuestions = getQuestions(path, jsonContent.current);
		io.emit('changeQuestions', newQuestions);
		return false;
}

function initializeData() {
		var contents = fs.readFileSync(snackDataPath);
		snackDataJson = JSON.parse(contents);
}

function analyze(path) {
	var contents = fs.readFileSync(path);
	var userSurveyJson = JSON.parse(contents);
	
	var scoreList = [];
	//initialize all scores to 0
	for(i=0; i < snackDataJson.snacks.length; i++) {
		scoreList[scoreList.length] = 0;
	}
		
	// score calories
	for(i=0; i < snackDataJson.snacks.length; i++) {
		console.log(snackDataJson.snacks[i].calories);
		
		if(userSurveyJson.data.Calories == 0) {
			if(snackDataJson.snacks[i].calories <= 100) {
				scoreList[i] = scoreList[i] + 3;
			} else if (snackDataJson.snacks[i].calories >= 160) {
			} else {
				scoreList[i] = scoreList[i] + 3 - (snackDataJson.snacks[i].calories - 100) / 20;
			}
		}

		if(userSurveyJson.data.Calories == 1) {
			if(snackDataJson.snacks[i].calories >= 100 && snackDataJson.snacks[i].calories <= 200) {
				scoreList[i] = scoreList[i] + 3;
			} else if (snackDataJson.snacks[i].calories > 200) {
				scoreList[i] = scoreList[i] + 3 - (snackDataJson.snacks[i].calories - 200) / 20;
				
			} else if (snackDataJson.snacks[i].calories < 100) {
				scoreList[i] = scoreList[i] + 3 - (100 - snackDataJson.snacks[i].calories) / 20;
			}
		}

		if(userSurveyJson.data.Calories == 2) {
			if(snackDataJson.snacks[i].calories > 200) {
				scoreList[i] = scoreList[i] + 3;
			} else if (snackDataJson.snacks[i].calories > 240) {
				scoreList[i] = scoreList[i] + 3 - (300 - snackDataJson.snacks[i].calories) / 20;
			} else  {
			}
		}
	}
	console.log("post calorie score:" + scoreList);
	
	//score flavor
	for(i=0; i < snackDataJson.snacks.length; i++) {
		if((snackDataJson.snacks[i].flavor == "salty" && userSurveyJson.data.Flavor == 0)
		 || (snackDataJson.snacks[i].flavor == "fruity" && userSurveyJson.data.Flavor == 1)
			 || (snackDataJson.snacks[i].flavor == "sugary" && userSurveyJson.data.Flavor == 2)
			 || (snackDataJson.snacks[i].flavor == "sour" && userSurveyJson.data.Flavor == 3)
			 || (snackDataJson.snacks[i].flavor == "bitter" && userSurveyJson.data.Flavor == 4)
			) {
			scoreList[i] = scoreList[i] + 2;
		}
	}
	console.log("post flavor score:" + scoreList);
	
	//score texture
	for(i=0; i < snackDataJson.snacks.length; i++) {
		if((snackDataJson.snacks[i].texture == "crunchy" && userSurveyJson.data.Texture == 0)
		 	 || (snackDataJson.snacks[i].texture == "crispy" && userSurveyJson.data.Texture == 1)
			 || (snackDataJson.snacks[i].texture == "chewy" && userSurveyJson.data.Texture == 2)
			 || (snackDataJson.snacks[i].texture == "mushy" && userSurveyJson.data.Texture == 3)
			 || (snackDataJson.snacks[i].texture == "smooth" && userSurveyJson.data.Texture == 3)
			) {
			scoreList[i] = scoreList[i] + 2;
		}
	}
	console.log("post texture score:" + scoreList);
	
	//TOOO extra options
	
	//TODO post best options
	var firstIndex = 0;
	var firstScore = 0;
	var secondIndex = 0;
	var secondScore = 0;
	
	for(i=0; i < scoreList.length; i++) {
		if(scoreList[i] > firstScore) {
			secondIndex = firstIndex;
			secondScore = firstScore;
			firstIndex = i;
			firstScore = scoreList[i];
		} else if (scoreList[i] > secondScore) {
			secondIndex = i;
			secondScore = scoreList[i];
		}
	}
	
	console.log(scoreList);
	console.log("top recommendations" + firstIndex + " and " + secondIndex);
	var items = {
		first: snackDataJson.snacks[firstIndex],
		second: snackDataJson.snacks[secondIndex]
	}
	console.log(items)
	return items;
}

reload(server, app);