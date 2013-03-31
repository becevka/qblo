/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    io = require('socket.io'),
    board = require('./routes/board'),
    path = require('path');

var mongodb = require('mongodb');
var config = require('./config');

var host = config.mongodb.server || 'localhost';
var port = config.mongodb.port || mongodb.Connection.DEFAULT_PORT;
var dbOptions = {
    auto_reconnect: config.mongodb.autoReconnect,
    poolSize: config.mongodb.poolSize
};
var db = new mongodb.Db('local', new mongodb.Server(host, port, dbOptions), {safe: true});

var app = express();

app.configure(function () {
    app.set('port', config.site.port || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.cookieParser(config.site.cookieSecret));
    app.use(express.cookieSession({secret: config.site.sessionSecret}));
    app.use(express.csrf());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var users, boards;

db.open(function (err, db) {
    if (err) {
        throw err;
    }
    console.log("DB connected");
});

users = db.collection('users');
users.count(function (err, count) {
    if (count === 0) {
        users.insert({email: 'admin'}, function (err, inserted) {
            if (err) {
                throw err;
            }
            users.ensureIndex({"email": 1}, {unique: true}, function (err, inserted) {
                if (err) {
                    throw err;
                }
            });
        });
    }
});
boards = db.collection('boards');
boards.count(function (err, count) {
    if (count === 0) {
        boards.insert({name: 'qblo'}, function (err, inserted) {
            if (err) {
                throw err;
            }
            boards.ensureIndex({"name": 1}, {unique: true}, function (err, inserted) {
                if (err) {
                    throw err;
                }
            });
        });
    }
});


//mongodb middleware
var middleware = function (req, res, next) {
    req.users = users;
    req.boards = boards;
    next();
};

app.get('/', middleware, routes.index);
app.get('/partials/:name', routes.partials);

app.post('/auth', middleware, user.auth);
app.get('/user', middleware, user.user);
app.get('/logout', middleware, user.logout);
app.get('/dashboard', middleware, user.dashboard);

app.post('/board', middleware, board.create);
app.get('/board/:id', middleware, board.board);

var server = http.createServer(app);
io = io.listen(server);
server.listen(app.get('port'), function () {
    console.log("Node server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

