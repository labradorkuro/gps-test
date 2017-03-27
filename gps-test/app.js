var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var index = require('./routes/index');
var post_test = require('./routes/post-test');
var location_map = require('./routes/location_map');
var users = require('./routes/users');
var config = require('config');

pg = require('pg');
pg.defaults.poolSize = 100;
sequelize = require('./libs/dbconn')(config);
models = require('./models')(sequelize);

var location_api = require('./api/location');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/post-test', post_test);
app.use('/location_map', location_map);
app.use('/users', users);

app.post('/location_post',upload.array(),location_api.location_post); //api
app.get('/location_get',location_api.location_get);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// Database migration
var sync = require('./routes/sync');
app.get('/devel/sync/:table', sync.one(models));
app.post('/devel/sync', sync.all(sequelize));
app.use(logger('dev',{imediate:true}));

var loc = models['location'];
var moist = models['plants_moist'];

var options = { "schema": "location_system" };
loc.sync(options);
moist.sync(options);

module.exports = app;
