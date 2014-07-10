var express = require('express.io');
var http = require('http');
var app = express();
app.http().io();

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// http routes
// var routes = require('./routes/index');

var songs = require('./songs.json');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));


app.locals.songs = require('./songs.json');

app.io.route('ready', function(req) {
    app.io.broadcast('new visitor', req.data);
});
app.io.route('scroll', function(req) {
    app.io.broadcast('scroll', req.data);
});

// Routing
// app.use(express.Router());

app.get('/',function(req,res) {
    res.render('index', {
        title: 'Songs'
    });
});

app.get('/songs/:songid?', function(req, res) {
    var song = songs[req.params.songid.split(':')[0]];
    res.render('index', {
        title: 'Songs - ' + song.title,
        currentSong: song
    });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = app;
