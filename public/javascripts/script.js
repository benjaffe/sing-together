var socket = io.connect();

var songIndex = location.pathname.split('songs/')[1];
var scrollPos = [0,0];
var state = {};



socket.on('connect', function(client){

	console.log('connected!');

	state.timestamp = Date.now();
	state.songIndex = songIndex;
	state.scrollPos = scrollPos;
	state.weJustMatchedSomeoneElsesScroll = false;

	socket.on('id',function(id) {
		state.clientid = id;
	});

	socket.emit('ready', state);

	document.addEventListener('scroll', function(e) {
		if (!state.weJustMatchedSomeoneElsesScroll) {

			var scrollPos = {x: window.scrollX, y: window.scrollY};
			var data = {
				timestamp: Date.now(),
				scrollPos: scrollPos,
				clientid: socket.id
			};
			socket.emit('scroll', data);
			console.log('Sending scroll position');
		}
	});


	socket.on('new visitor', function(data){
		console.log(Date.now() - data.timestamp);
		if (data.songIndex !== songIndex) {
			location.href = location.origin + '/songs/' + data.songIndex;
		}
	});

	socket.on('scroll', function(data){
		if (data.clientid === state.clientid) {
			console.log('WE ARE SCROLLING!   ' + data.clientid + '   ' + state.clientid);
		} else {
			console.log('SOMEONE ELSE IS SCROLLING!   ' + data.clientid + '   ' + state.clientid);
			// console.log(Date.now() - data.timestamp);
			state.weJustMatchedSomeoneElsesScroll = true;
			setTimeout(function(){
				state.weJustMatchedSomeoneElsesScroll = false;
			},100);

			var scrollPos = data.scrollPos;
			window.scrollTo(scrollPos.x, scrollPos.y);
			// console.log('Receiving scroll position ' + scrollPos.y);
		}
	});

});

