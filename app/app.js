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

app.locals.siteTitle = 'Snack Selector';

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
	
	
	questionContent = getQuestions(userPath);
	console.log(questionContent.calories);
	io.emit('setQuestions', questionContent);
	
	
	socket.on('disconnect', function(){
		fs.unlinkSync(__dirname + '/data/' + socket.id + '.json');
    console.log('user disconnected');
  });
	
	socket.on('clicked', function(data) {
		console.log(socket.id + ' clicked option' + data);
		writeAnswer(userPath, data);
		questionContent = getQuestions(userPath);
		io.emit('changeQuestions', questionContent);
	});
	
});

function getQuestions(path) {
	var contents = fs.readFileSync(path);
 	var jsonContent = JSON.parse(contents);
	var questions = fs.readFileSync(__dirname + '/data/' + jsonContent.current + '.json');
	return JSON.parse(questions);
}

function writeAnswer(path, data) {
		var contents = fs.readFileSync(path);
		var jsonContent = JSON.parse(contents);
		console.log(data);
	
		var questions = fs.readFileSync(__dirname + '/data/' + jsonContent.current + '.json');
		var questionsObj = JSON.parse(questions);
		var name = questionsObj.name;
		jsonContent.data[jsonContent.current] = {name : data};
		jsonContent.current = jsonContent.current + 1;
		fs.writeFileSync(path, JSON.stringify(jsonContent), 'utf8');
}

reload(server, app);