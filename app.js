var express = require('express.io');
var http = require('http');
var app = express();
app.http().io();

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');

// http routes
// var routes = require('./routes/index');

var songs = require('./songs.json');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.cookieParser());
// app.use(express.session({secret: 'monkey'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));


app.locals.songs = require('./songs.json');


// Routing
// app.use(express.Router());

app.get('/',function(req,res) {
    res.render('index', {
        title: 'Songs'
    });
});

app.get('/songs/:songid?', function(req, res) {
    var song = songs[req.params.songid];
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


var locker;
var lockingTimer;
var lockingDuration = 1000;

app.io.route('ready', function(req) {
    app.io.broadcast('new visitor', req.data);
    req.io.emit('id', req.socket.id);
});
app.io.route('scroll', function(req) {
    // if scrolling is locked by someone, and someone else sends scroll events, reject them
    if (locker && locker !== req.socket.id) return false;

    // send the scroll events to everyone else
    req.io.broadcast('scroll', req.data);

    // locking logic
    if (!lockingTimer) {
        locker = req.socket.id;
        req.io.broadcast('scrollstart', req.data);
        console.log('locked by ' + locker);
    } else {
        clearTimeout(lockingTimer);
    }
    lockingTimer = setTimeout(function(){
        // console.log('unlocked');
        locker = undefined;
        lockingTimer = undefined;
    },lockingDuration);
});

app.io.route('addsong', function(req){
    var song = req.data;
    console.log(songs.length);
    songs.push(song);
    console.log(songs.length);
    fs.writeFile('songs.json',JSON.stringify(songs,null,'\t'), function(err) {
        if (err) console.log('ERROR!', err);
        else console.log('JSON successfully saved');
    });
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
