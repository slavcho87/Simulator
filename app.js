var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var mongoose = require('mongoose');
var fs = require('fs');

var configurations = require('./routes/configurations');
var maps = require('./routes/maps');
var simulation = require('./routes/simulation');
var user = require('./routes/user');

var port = process.env.PORT || baseConfig().port;
var locationDB = baseConfig().locationDB;
var nameDB = baseConfig().nameDB;

//MongoDB connection
mongoose.connect('mongodb://'+locationDB+'/'+nameDB, function(error){
    if(!error){
        console.log("mongodb connected ...");
    }else{
        throw error;
    }
});

function baseConfig(){
    var file = fs.readFileSync('./baseConfig.json', 'utf8');
    return JSON.parse(file);
}

var app = express();

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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

var users = {};
var reqUsers = {};
var sceneList = [];

function getUserToSincronize(mapID, sceneId, socketId){    
    for(var index in users){
        if(index!=socketId && users[index].mapId==mapID && users[index].sceneId==sceneId){
            return users[index];
        }
    }
    return null;
}

var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log("user connected");
    users[socket.id] = {socket:socket, mapId: "", sceneId: ""};
    
    socket.on('user change position', function(data){
        socket.broadcast.emit('user change position', data);
    });
    
    socket.on('sincronize map', function(data){
        var user = users[socket.id];
        users[socket.id] = {socket: user.socket, mapId: data.mapId, sceneId: data.sceneId};
        
        var userToReq = getUserToSincronize(data.mapId, data.sceneId, socket.id);
        
        if(userToReq != null){
            reqUsers[userToReq.socket.id] = socket; 
            userToReq.socket.emit('sincronize map', data);
        }
    });
    
    socket.on('sincronize map result', function(data){
        var user = reqUsers[socket.id];
        
        if(user){
            user.emit('sincronize map result', data);
            delete reqUsers[socket.id];
        }
    });
    
    socket.on('start-pause', function(data){ 
        socket.broadcast.emit('start-pause', data);
    });

    //Evento que se ejecuta para obtener la lista de recomendadores
    socket.on('getStrategies', function(data){
        socket.broadcast.emit('getStrategies', data); //este evento lo tiene el recomendador
    });
    
    //Evento que se ejecuta cuando el recomendador devuelve la lista de recomendadores
    socket.on('strategies result', function(data){
        socket.broadcast.emit('strategies result', data); //este evento lo tiene el navegador
    });
        
    //Evento que se ejecuta para obtener la lista items recomendados
    socket.on('getRecommend', function(data){
        socket.broadcast.emit('recommend', data); //este evento lo tiene el recomendador
    });
    
    //Evento que ejecuta el servidor para dejar los resultados al navegador 
    socket.on('recommended items', function(data){
        socket.broadcast.emit('recommended items', data); //este evento lo tiene el navegador
    });
    
    socket.on('user exit', function(data){
        users[socket.id].mapId = "";
        users[socket.id].sceneId = "";
        socket.broadcast.emit('user exit', data); 
    });
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
        delete users[socket.id];
    });
});

module.exports = app;
