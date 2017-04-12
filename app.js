var express       =  require('express');
var path          =  require('path');
var favicon       =  require('serve-favicon');
var logger        =  require('morgan');
var cookieParser  =  require('cookie-parser');
var bodyParser    =  require('body-parser');
var index         =  require('./routes/index');
var users         =  require('./routes/users');
var ejs           =  require('ejs');
var app           =  express();
var multer        = require('multer');
var upload        = multer();
var formidable = require('formidable');
var form = new formidable.IncomingForm();
//var controller    =  require('./routes/controller');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//reqire from multer for passing the post request form the form-data from the postman
app.use(upload.array());
//app.use(express.bodyParser());
//routes

app.use('/', index);
app.use('/users', users);
//routes with controller action
var controller    =  require('./routes/controller');
app.get('/test',    controller.test);
app.post('/hello', controller.hello);
app.post('/register' ,controller.register);
app.post('/login', controller.login);

var multiparty = require('multiparty');

//var multi = multiparty();
app.post('/test1',upload.array(), function (req, res){
     var x = req.body.x;
     console.log("working fine");
    // form.parse(x);
     console.log(x);
       res.send(x)
      //console.log(x);
});
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

module.exports = app;
