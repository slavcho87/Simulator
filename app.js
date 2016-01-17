var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var mongoose = require('mongoose');

var configurations = require('./routes/configurations');
var maps = require('./routes/maps');
var simulation = require('./routes/simulation');
var user = require('./routes/user');

var port = process.env.PORT || 81;
var locationDB = 'localhost';
var nameDB = 'simulator';

//MongoDB connection
mongoose.connect('mongodb://'+locationDB+'/'+nameDB, function(error){
    if(!error){
        console.log("mongodb connected ...");
    }else{
        throw error;
    }
});

var app = express();

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multipart());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
var server = app.listen(port, function () {
    console.log("Express server listening on port " + port);
});

app.use('/settings', ensureAuthorized, configurations);
app.use('/maps', ensureAuthorized, maps);
app.use('/simulation', simulation);
app.use('/user', user);

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

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

var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('user change position', function(data){
        console.log(data);
    });
    
    socket.on('user change speed', function(data){
        console.log(data);
    });
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

module.exports = app;
