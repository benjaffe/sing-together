var socket = io.connect();

var songIndex = location.pathname.split('songs/')[1];
var scrollPos = [0,0];
var state = {};



socket.on('connect', function(client){

	console.log('connected!');

	state.timestamp = Date.now();
	state.songIndex = songIndex;
	state.scrollPos = scrollPos;
	state.justAutoScrolled = false;

	socket.on('id',function(id) {
		state.clientid = id;
	});

	socket.emit('ready', state);

	document.addEventListener('scroll', function(e) {
		// console.log(state.justAutoScrolled);
		if (!state.justAutoScrolled) {

			var scrollPos = {x: window.scrollX, y: window.scrollY};
			var data = {
				timestamp: Date.now(),
				scrollPos: scrollPos,
				clientid: socket.id
			};
			socket.emit('scroll', data);
			// console.log('Sending scroll position');
		}
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
		state.justAutoScrolled = true;
		setTimeout(function(){
			state.justAutoScrolled = false;
		},0);

		var scrollPos = data.scrollPos;
		window.scrollTo(scrollPos.x, scrollPos.y);
		// animateScrollTo(scrollPos.x, scrollPos.y);
		// console.log('Receiving scroll position ' + scrollPos.y);
	});

});

// var animateScrollTo = function(x,y) {
// 	var scrollTickCoords = {x: window.scrollX, y: window.scrollY};
// 	var offset;
// 	var lead = 1;
// 	var interval = setInterval(function(){
// 		if (y !== scrollTickCoords.y) {
// 			offset = y - scrollTickCoords.y;
// 			scrollTickCoords.y = Math.floor(scrollTickCoords.y + offset/20 + lead*Math.pow(offset,0));
// 			console.log(scrollTickCoords.y);
// 		} else {
// 			clearInterval(interval);
// 		}
// 	},100);
// };
