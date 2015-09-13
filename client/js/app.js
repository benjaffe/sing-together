var SongList = React.createClass({
  render: function() {
    var createItem = function(itemText, index) {
      return <li key={index + itemText}>{itemText}</li>;
    };
    return <ul>{this.props.songs.map(createItem)}</ul>;
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
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var nextItems = this.state.songs.concat([this.state.text]);
    var nextText = '';
    this.setState({songs: nextItems, text: nextText});
  },
  render: function() {
    return (
      <div>
        <h3>Sing Sing!</h3>
        <SongList songs={this.state.songs} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{'Add #' + (this.state.songs.length + 1)}</button>
        </form>
      </div>
    );
  }
});

React.render(<SingSingApp />, document.getElementById('container'));