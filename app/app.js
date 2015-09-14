/** @jsx React.DOM */
define(['react', 'firebase', 'lodash'], function(React, Firebase, _) {

  var Song = React.createClass({
    getInitialState: function() {
      return { editing: false };
    },
    toggleEditMode: function() {
      this.setState({ editing: !this.state.editing });
    },
    render: function() {
      var currentSong = this.props.currentSong;
      if (!currentSong) {
        return <div className="song-details">No Song Selected</div>;
      }

      function handleChange(obj) {
        console.log('HI!');
        console.log(obj);
      }

      return (
        <div className="song-details">
          <h2 className="song-title">Title: {currentSong.title}</h2>
          <h3 className="song-artist">Artist: {currentSong.artist}</h3>
          <button className="song-edit-btn" onClick={this.toggleEditMode}>{this.state.editing ? 'Editing Song' : 'Edit Song'}</button>
          <div className="row song-property-group">
            <div className="col-xs-4 col-sm-2 song-property song-key">Key: <br/>{currentSong.key}</div>
            <div className="col-xs-4 col-sm-2 song-property song-capo">Capo: <br/>{currentSong.capo}</div>
            <div className="col-xs-4 col-sm-2 song-property song-readiness">Readiness: <br/>{currentSong.readiness}</div>
            <div className="col-xs-4 col-sm-2 song-property song-whose">Whose: <br/>{currentSong.whose}</div>
            <div className="col-xs-6 col-sm-3 song-property song-instruments">Instruments: <br/>{currentSong.instruments}</div>
          </div>
          <div className="song-lyrics">{currentSong.lyrics}</div>
        </div>
      );
    }
  });

  var SongListItem = React.createClass({
    render: function() {
      return <li><a href={'#'+this.props.song.id}>{this.props.song.title}</a></li>;
    }
  });

  var SongList = React.createClass({
    render: function() {
      var createItem = function(song, index) {
        return <SongListItem song={song} />;
      };
      return <ul className="song-list">{this.props.songs.map(createItem)}</ul>;
    }
  });

  var SingSingApp = React.createClass({
    getInitialState: function() {
      var body = document.body;
      var html = body.parentElement;
      return {
        songs: [],
        songID: null,
        scrollPercent: 0,
        scrollDisabled: false,
        uid: Date.now() + Math.round(Math.random()*100000),
        documentHeight: Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
        documentWidth: Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth )
      };
    },

    componentWillMount: function() {
      var self = this;
      this.fbRef = new Firebase("https://sing-sing.firebaseio.com/");

      this.fbSongsRef = this.fbRef.child('songs');
      this.fbSongsRef.on("child_added", function(ss) {
        this.state.songs.push(ss.val());
        this.setState({
          songs: this.state.songs
        });
      }.bind(this));

      this.fbCurrSongRef = this.fbRef.child('currentSongID');
      this.fbCurrSongRef.on('value', function(ss) {
        self.setState({ songID: ss.val() });
        // this is for clients that are "following along" with the change
        window.location.hash = '#' + ss.val();
      }).bind(this);

      this.fbCurrScrollRef = this.fbRef.child('scroll');
      this.fbCurrScrollRef.on('value', function(ss) {
        var scroll = ss.val();
        // if we're the scroller, don't change our scroll position
        // ...unless the scroller is > 5000 ms old
        if ((scroll.scroller && scroll.scroller === self.state.uid)) {
          return;
        }

        self.setState({ scroll: scroll });

        // this is for clients that are "following along" with the change
        // function scrollAim(scroll) {
        //   var currentScroll = window.scrollY / (self.state.documentHeight - window.innerHeight);
        //   var scrollIntermediate = {
        //     y: (currentScroll + scroll.y) / 2
        //   };
        //   console.log(currentScroll, scroll.y);
        //   window.scrollTo(0, scrollIntermediate.y * self.state.documentHeight);
        //   if (Math.abs(currentScroll - scroll.y) > 0.5) {
        //     console.log(Math.abs(currentScroll - scroll.y), currentScroll, scroll.y);
        //     setTimeout(scrollAim.bind(null, scroll), 16);
        //   }
        // }
        // scrollAim(self.state.scroll);

      }).bind(this);

      document.addEventListener('scroll', _.debounce(this.scrollHappened, 100, {maxWait: 100}));
    },

    componentDidMount: function() {
      this.setState(this.getDocumentDimensions());
    },

    getDocumentDimensions: function() {
      var body = document.body;
      var html = body.parentElement;
      return {
        documentHeight: Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
        documentWidth: Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth )
      };
    },

    scrollHappened: function() {

      this.setState(this.getDocumentDimensions);

      // this represents our position (from 0 to 1) on the page
      var scrollPos = {
        scroller: this.state.uid,
        timestamp: Firebase.ServerValue.TIMESTAMP,
        // x: Math.min(window.scrollX / (this.state.documentWidth - window.innerWidth), 1),
        y: Math.min(window.scrollY / (this.state.documentHeight - window.innerHeight), 1)
      };

      app.fbCurrScrollRef.set(scrollPos);
    },

    render: function() {
      var currentSongID = this.state.songID;
      var currentSong = _.find(this.state.songs, function(song){
        return (song.id+'') === currentSongID;
      }.bind(this));

      return (
        <div>
          <SongList songs={this.state.songs} />
          <Song currentSong={currentSong} />
        </div>
      );
    }
  });

  // the hash contains the current song
  function routeChanged() {
    var route = window.location.hash.substr(1);
    app.fbCurrSongRef.set(route);
  }

  window.addEventListener('hashchange', routeChanged);

  // start everything! http://www.youtube.com/watch?v=vDy2xWpZWVc&t=0m28s
  var app = React.render(<SingSingApp />, document.getElementById('container'));
  return app;
});