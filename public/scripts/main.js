require.config({
	paths: {
		'socket.io': '/socket.io/socket.io.js',
		'hammer': 'hammer.min'
	}
});

require(['socket.io','aim', 'hammer'],
function(socket, aim, Hammer){


	socket = io.connect();

	var songIndex = location.pathname.split('songs/')[1];
	var scrollPos = [0,0];
	var state = {};
	var scrollDisabled = false;
    var timeOfLastScrollEvent = Date.now();
    var minTimeBetweenScrollEvents = 50;

	var body = document.body;
    var html = document.documentElement;
    var songListElem = document.getElementById('song-list')
    var songDetailElem = document.getElementById('song-detail');

    // event handling
    var mc = new Hammer(songDetailElem);
    var mcManager = mc.Manager(songDetailElem,{});

    mc.get('pinch').set({enable: true});
    mcManager.add(new Hammer.Tap({event: 'tripletap', taps: 3}));

    mc.on('tripletap', function() {
    	html.classList.toggle('fullscreen');
    });

    mc.on('pinchin pinchout', function(e) {
    	var fs = parseFloat(body.style.fontSize) || 1;
    	if (e.type === 'pinchin') {
    		fs *= 1.1;
    	} else {
    		fs /= 1.1;
    	}
    	body.style.fontSize = fs + 'em';
    });


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
			if (Date.now() - timeOfLastScrollEvent < minTimeBetweenScrollEvents) return false;

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
			timeOfLastScrollEvent = Date.now();

		});


		socket.on('new visitor', function(data){
			// console.log(Date.now() - data.timestamp);
			if (data.songIndex && data.songIndex !== songIndex) {
				location.href = location.origin + '/songs/' + data.songIndex;
			}
		});

		document.getElementById('addsong-form').addEventListener('submit',function(e) {
			e.preventDefault();
			console.log('adding fake song');
			var song = {};
			var getValue = function(key) {
				return document.getElementById('newsong-' + key).value;
			};

			song.title = getValue('title');
			song.artist = getValue('artist');
			song.key = getValue('key');
			song.capo = getValue('capo');
			song.readiness = getValue('readiness');
			song.whose = getValue('whose');
			song.instruments = getValue('instruments');
			song.lyrics = getValue('lyrics');
			console.log(song);

			socket.emit('addsong', song);

		});

		document.getElementById('addsong-start').addEventListener('click', function(e){
			document.getElementById('addsong-form').style.display = 'block';
		});
		document.getElementById('addsong-cancel').addEventListener('click', function(e){
			document.getElementById('addsong-form').style.display = 'none';
		});


		socket.on('scrollstart', function(data) {
			var indicatorElem = document.createElement('div');
			indicatorElem.className = 'scroll-indicator';
			indicatorElem.style.top = window.scrollY+'px';
			document.body.appendChild(indicatorElem);
			setTimeout(function(){
				indicatorElem.remove();
			},4000);
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

