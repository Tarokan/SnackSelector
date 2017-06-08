var express = require('express');
var reload = require('reload');
var app = express();

app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/survey'));

app.locals.siteTitle = 'Snack Selector';

var server = app.listen(app.get('port'), function() {
  console.log('Listening on ports' + app.get('port'));
});

reload(server, app);