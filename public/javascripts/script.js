var socket = io.connect();

var songIndex = location.pathname.split('songs/')[1].split(':')[0];
var scrollPos = [0,0];
var state = {
	songIndex: songIndex,
	scrollPos: scrollPos
};

socket.emit('ready', state);



document.addEventListener('scroll', function(e) {
	scrollPos = [window.scrollX, window.scrollY];
	socket.emit('scroll', scrollPos);
});


socket.on('new visitor', function(data){
	console.log(data);
	if (data.songIndex !== songIndex) {
		location.href = location.origin + '/songs/' + data.songIndex;
	}
});

socket.on('scroll', function(scrollPos){
	window.scrollTo(scrollPos[0], scrollPos[1]);
});