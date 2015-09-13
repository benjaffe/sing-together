var Song = React.createClass({
  render: function() {
    var currentSong = this.props.currentSong;
    if (!currentSong) {
      return <div className="song-details">No Song Selected</div>;
    }

    return (
      <div className="song-details">
        <h2 className="song-title">Title: {currentSong.title}</h2>
        <h3 className="song-artist">Artist: {currentSong.artist}</h3>
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
    return {songs: [], text: ''};
  },
  componentWillMount: function() {
    this.fbRef = new Firebase("https://sing-sing.firebaseio.com/songs/");
    this.fbRef.on("child_added", function(dataSnapshot) {
      this.state.songs.push(dataSnapshot.val());
      this.setState({
        songs: this.state.songs
      });
    }.bind(this));
  },
  render: function() {
    var currentSongID = this.props.songID;
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

function render() {
  var route = window.location.hash.substr(1);
  React.render(<SingSingApp songID={route} />, document.getElementById('container'));
}

window.addEventListener('hashchange', render);
render();


