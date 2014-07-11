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

	var body = document.body;
    var html = document.documentElement;


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

			// code to get the document dimensions
			var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
			var documentWidth = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );

			// this represents our position (from 0 to 1) on the page
			var scrollPos = {
				x: window.scrollX / (documentWidth - window.innerWidth),
				y: window.scrollY / (documentHeight - window.innerHeight)
			};
			var data = {
				timestamp: Date.now(),
				scrollPos: scrollPos,
				clientid: socket.id
			};
			socket.emit('scroll', data);

		});


		socket.on('new visitor', function(data){
			// console.log(Date.now() - data.timestamp);
			if (data.songIndex && data.songIndex !== songIndex) {
				location.href = location.origin + '/songs/' + data.songIndex;
			}
		});

		socket.on('scrollstart', function(data) {
			var indicatorElem = document.createElement('div');
			indicatorElem.className = 'scroll-indicator';
			indicatorElem.style.top = window.scrollY+'px';
			document.body.appendChild(indicatorElem);
			setTimeout(function(){
				indicatorElem.classList.add('fade');
				setTimeout(function(){
					indicatorElem.remove();
				},4000);
			},0);
			console.log('Scroll start!');
			console.log(indicatorElem);
		});

		socket.on('scroll', function(data){

			aim.scrollDisabled(true);
			setTimeout(function(){
				aim.scrollDisabled(false);
			},0);

			// code to get the document dimensions
			var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
			var documentWidth = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );

			var scrollPos = data.scrollPos;

			var scrollPosAbs = {
				x: scrollPos.x * (documentWidth - window.innerWidth),
				y: scrollPos.y * (documentHeight - window.innerHeight)
			};

			aim.animateScrollTo(scrollPosAbs.x, scrollPosAbs.y);
		});

	});


});

