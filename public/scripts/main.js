require.config({
	paths: {
		'socket.io': '/socket.io/socket.io.js'
	}
});

require(['socket.io','aim'],
function(socket, aim){


	socket = io.connect();

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


});

