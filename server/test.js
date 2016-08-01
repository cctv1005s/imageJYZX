var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webrouter = require('./webrouter');//路由处理
var config = require('./config')
var passport = require('passport');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var fs = require('fs');

var partials = require('express-partials');
var _ = require('lodash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'ejs');

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});//日志记录文件

//中间件
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../client/public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(partials());



//session

app.use(session({
    secret: 'JYZX-session',
    cookie: {
        maxAge: 7*24 * 60 * 60 * 60
    },
    store:new RedisStore({
      port: '6379',
      host: '127.0.0.1',
      db: 0,
      pass:''
    })
    ,
    resave:false,
    saveUninitialized:false
}));

_.extend(app.locals,{
  webname:config.webname
})

app.use(function(req,res,next){
    req.session.user = 'one';
    next();
});

app.get('/',function(req,res,next){
    if(req.session.user){
        var x = req.session.user;
        req.session.user ="a" + x;
        console.log(req.session);
    }
    res.send('test ok');
})


// error handlers

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    // res.status(err.status || 500);
    // res.render('error', {
    //   message: err.message,
    //   error: err
    // });
    console.log(err);
  });
}

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   // res.status(err.status || 500);
//   // res.render('error', {
//   //   message: err.message,
//   //   error: {}
//   // });
//   console.log(err);
//   throw(err);
// }); 

var port = 8080;
app.listen(port||3000);
console.log('app lisent on '+port||3000);

module.exports = app;


