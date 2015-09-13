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
        <div className="song-lyrics">Lyrics: {currentSong.lyrics}</div>
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
    return {songs: [], songID: null};
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


