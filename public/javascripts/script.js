var socket = io.connect();

var songIndex = location.pathname.split('songs/')[1];
var scrollPos = [0,0];
var state = {};
var scrollDisabled = false;


socket.on('connect', function(client){

	console.log('connected!');

	state.timestamp = Date.now();
	state.songIndex = songIndex;
	state.scrollPos = scrollPos;

	socket.on('id',function(id) {
		state.clientid = id;
	});

	socket.emit('ready', state);

	document.addEventListener('scroll', function(e) {
		if (scrollDisabled) return false;

		var scrollPos = {x: window.scrollX, y: window.scrollY};
		var data = {
			timestamp: Date.now(),
			scrollPos: scrollPos,
			clientid: socket.id
		};
		socket.emit('scroll', data);

	});


	socket.on('new visitor', function(data){
		// console.log(Date.now() - data.timestamp);
		if (data.songIndex !== songIndex) {
			location.href = location.origin + '/songs/' + data.songIndex;
		}
	});

	socket.on('scroll', function(data){
		// console.log('SOMEONE ELSE IS SCROLLING!   ' + data.clientid + '   ' + state.clientid);
		// console.log(Date.now() - data.timestamp);
		scrollDisabled = true;
		setTimeout(function(){
			scrollDisabled = false;
		},0);

		var scrollPos = data.scrollPos;
		// window.scrollTo(scrollPos.x, scrollPos.y);
		animateScrollTo(scrollPos.x, scrollPos.y);
		// console.log('Receiving scroll position ' + scrollPos.y);
	});

});
var interval;
var yTarget;
var maxScrollSpeed = 60;
var animateScrollTo = function(x,y) {
	yTarget = y;
	scrollDisabled = true;
	console.log('scrolling from ' + window.scrollY + ' to ' + yTarget);
	var scrollTickCoords = {x: window.scrollX, y: window.scrollY};
	var offset;
	var lead = 1;
	if (interval) return false;

	interval = setInterval(function(){
		offset = yTarget - scrollTickCoords.y;
		var offsetSign = Math.pow(offset,0);

		if (Math.abs(offset) >= 1) {
			console.log(offset + '  ' + scrollTickCoords.y);
			scrollTickCoords.y = scrollTickCoords.y + offset/10;
			window.scrollTo(window.scrollX, scrollTickCoords.y);
			// console.log(scrollTickCoords.y);
		} else {
			clearInterval(interval);
			interval = null;
			scrollDisabled = false;
		}
	},16);
};
