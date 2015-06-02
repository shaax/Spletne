var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors'); 

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use('/priljubljene', require('./routes/priljubljene'));
app.use('/users', require('./routes/users'));
app.use('/skupine', require('./routes/skupina'));
app.use('/login', require('./routes/login'));
app.use('/dodajVSkupino', require('./routes/dodajVSkupino'));
app.use('/ustvariSkupino', require('./routes/ustvariSkupino'));
app.use('/priljubljene_dodaj', require('./routes/priljubljene_dodaj'));
app.use('/priljubljene_izbrisi', require('./routes/priljubljene_izbrisi'));
app.use('/priljubljene_uredi', require('./routes/priljubljene_uredi'));
app.use('/dogodki', require('./routes/dogodki'));
app.use('/dogodki_dodaj', require('./routes/dogodki_dodaj'));
app.use('/dogodki_uredi', require('./routes/dogodki_uredi'));
app.use('/dogodki_izbrisi', require('./routes/dogodki_izbrisi'));
app.use('/pridobiLokacijo', require('./routes/pridobiLokacijo'));
app.use('/preveriPodatke', require('./routes/preveriPodatke'));
app.use('/registracija', require('./routes/registracija'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = app;
