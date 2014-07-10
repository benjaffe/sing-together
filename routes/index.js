var express = require('express');
var router = express.Router();
var songs = require('../songs.json');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Songs'
    });
});
router.get('/songs/:songid?', function(req, res) {
    var song = songs[req.params.songid];
    res.render('index', {
        title: 'Songs - ' + song.title,
        currentSong: song
    });
});

module.exports = router;
