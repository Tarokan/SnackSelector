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

//dictate number of questions
var surveyTotal = 3;

var questionRaw = fs.readFileSync(__dirname + '/data/questions.json');
var questionData = JSON.parse(questionRaw);

var server = app.listen(app.get('port'), function() {
  console.log('Listening on ports: ' + app.get('port'));
});
	
io.attach(server);

io.on('connection', function(socket) {
	var date = new Date();
  console.log(date+' : a user connected '+socket.id);
	
	//define where the user's data is stored
	var userPath = __dirname + '/data/' + socket.id + '.json';
	
	var template = {
		"current" : 0,
		"data"	: [
		]
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
		writeAnswer(userPath, data);
	});
	
});

function getQuestions(path, number) {
	return (questionData.questionSets[number]);
}

function writeAnswer(path, data) {
		var contents = fs.readFileSync(path);
		var jsonContent = JSON.parse(contents);
	
		var name = questionData.questionSets[jsonContent.current].name;
		var ob = {};
	  ob[name] = data;
	console.log(name);
	
	
		jsonContent.data[jsonContent.current] = ob;
		jsonContent.current = jsonContent.current + 1;
		var newQuestions = getQuestions(path, jsonContent.current);
		io.emit('changeQuestions', newQuestions);
		fs.writeFileSync(path, JSON.stringify(jsonContent), 'utf8');
		if(jsonContent.current == surveyTotal) {
			return true;
		} else {
			return false;	
		}
}

reload(server, app);