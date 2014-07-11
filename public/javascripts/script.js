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
		if (aim.scrollDisabled()) return false;

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
		aim.scrollDisabled(true);
		setTimeout(function(){
			aim.scrollDisabled(false);
		},0);

		var scrollPos = data.scrollPos;
		// window.scrollTo(scrollPos.x, scrollPos.y);
		aim.animateScrollTo(scrollPos.x, scrollPos.y);
		// console.log('Receiving scroll position ' + scrollPos.y);
	});

});
var aim = (function(){
	var interval;
	var maxScrollSpeed = 60;
	var scrollDisabled = false;
	var scrollDestination;
	return {

		animateScrollTo: function(x,y) {
			var scrollNextTick = {x: window.scrollX, y: window.scrollY};
			scrollDestination = {x: x, y: y};
			scrollDisabled = true;

			var offset = {};
			var lead = 1;

			// console.log('scrolling from ' + window.scrollY + ' to ' + scrollDestination.y);

			if (interval) return false;

			interval = setInterval(function(){
				offset = scrollDestination.y - scrollNextTick.y;
				// console.log('animating from ' + window.scrollY + ' to ' + scrollDestination.y);
				var offsetSign = Math.pow(offset,0);

				if (Math.abs(offset) >= 1) {
					scrollNextTick.y = scrollNextTick.y + offset/10;
					window.scrollTo(window.scrollX, scrollNextTick.y);
				} else {
					clearInterval(interval);
					interval = null;
					scrollDisabled = false;
				}
			},16);
		},

		scrollDisabled: function(value) {
			if (value)
				scrollDisabled = value;
			return scrollDisabled;
		}

	};
})();

