var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('chat_service:server');

var config = require('./config');
// var rooms = require('./internal/room_data')
var room_apis = require('./database/room_apis');
var configuration = require('./config');

var routes = require('./routes/index');
var users = require('./routes/users');
var sock = require('./routes/sock');

var app = express();
var port = process.env.PORT || config.PORT;
app.set('port', port);

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
mongoose.connect(configuration.MONGO_URI);

// set io a part of app
app.set('io', io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/sock/', sock);

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// var dbCheckRoom = function (rid, cb1, cb2) {
//     room_apis.existRoom(rid, function (err, obj) {
//         if (obj && obj.status == 'existRoom ok') {
//             cb1(err, obj);
//         } else {
//             cb2(err, obj);
//         }
//     })
// }

var dbJoinRoom = function (duser, drid, cb) {
    room_apis.joinRoom({room_id: drid, user: duser}, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            cb();
        }
    })
}

var dbCheckRoom = function (data, cb) {
    console.log('dbCheckRoom: ', data);
    room_apis.existUserInRoom(
        {room_id: data.room_id, user_id: data.user},
        function (err, data) {
            cb(err, data);
        }
    );
}

io.on('connection', function (socket) {
    console.log("Incomming connection from: " + socket.id);

    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function (data) {
        console.log(data);
    });

    //data = {room_id: 'asdf', user: 'mgao16'}
    socket.on('join', function (data) {
        console.log('new join: ', data);
        dbCheckRoom(data, function (err, res) {
            if (err) {
                console.log("socketio join room error", err);
                console.log("socketio join room res: ", res);
                io.to(socket.id).emit("error", {data: 'room_id does not exist'});
            } else {
                io.to(socket.id).emit("ok", {data: 'joined room_id' + data.room_id});
                socket.join(data.room_id, function () {
                    console.log(socket.rooms);
                    // dbJoinRoom(data.user, data.room_id, function () {
                    //     io.to(data.room_id, 'a new user ' + data.user + 'entered room.');
                    // })
                    io.to(data.room_id, 'a new user ' + data.user + 'entered room.');
                });
            }
        });

    });

    socket.on('logout', function (data) {
        console.log('socketio logout: ', data);

    })
});

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
module.exports = app;
