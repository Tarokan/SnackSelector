var express = require('express');
var reload = require('reload');
var dataFile = require('./data/1.json');
var app = express();
var fs = require('fs');
var io = require('socket.io')();

app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/survey'));
app.set('surveyData', dataFile);

app.locals.siteTitle = 'Snack Selector';

var server = app.listen(app.get('port'), function() {
  console.log('Listening on ports: ' + app.get('port'));
});

io.attach(server);

io.on('connection', function(socket) {
	var date = new Date();
  console.log(date+' : a user connected '+socket.id);
	fs.writeFileSync(__dirname + '/data/' + socket.id + '.json', "", 'utf8');
	
	socket.on('disconnect', function(){
//		try {
		fs.unlinkSync(__dirname + '/data/' + socket.id + '.json');
//		} catch (e) {
//			console.log(e.toString());
//		}
    console.log('user disconnected');
  });
	
	socket.on('questionloaded', function(data) {
		console.log(socket.id + ' arrived at question');
	});
	
	socket.on('clicked', function(data) {
		console.log(socket.id + ' clicked something');
		var asdf = socket.id
	});
});

reload(server, app);