var songtrackerApp = angular.module('songtrackerApp', []);

songtrackerApp.controller('SongListCtrl', function ($scope, $filter) {
	window.scopePointer = $scope;
	

	$scope.orderBy = 'title';
	// $scope.songs = $filter('filter')([],'search');
	$scope.songs = localStorage.songs ? JSON.parse(localStorage.songs) : [];
	window.blah = $scope.songs;

	$scope.currentSongIndex = null;
	$scope.pendingSongIndex = null;
	$scope.currentSong = null;
	$scope.pendingSong = null;
	$scope.focusInput = true;
	
	$scope.showSong = function(song) {

		$scope.currentSong = song;
		$scope.currentSongIndex = $scope.filteredSongs.indexOf(song);
		console.log('$scope.currentSongIndex');
		console.log($scope.currentSongIndex);
		//this.$index;
		// if(!!num) $scope.currentSongIndex = num;
		console.log($scope.filteredSongs.indexOf(song)); //unsorted index
		console.log($scope.filteredSongs); //---
		console.log(this.$index); //sorted index
		console.log(this); //little scope
		console.log($scope); //list scope
	};

	$scope.handleKeyPress = function(ev) {
		$scope.pressed = ev.which;
		// console.log(ev.which);
		var song_list_length = $scope.filteredSongs.length - 1;

		if ((ev.which >= 64 && ev.which <= 90) || ev.which === 8) {
			$scope.focusInput = true;
			$scope.pendingSongIndex = null;
			// $scope.pendingSong = $scope.filteredSongs[0];
			// $scope.pendingSongIndex = $scope.songs.indexOf($scope.filteredSongs[0]);
			// console.log($scope.songs.indexOf($scope.filteredSongs[0]));
			// console.log($scope.songs);
			// console.log($scope.filteredSongs);

			return false;
		}
		else if (ev.which === 13) {
			$scope.currentSong = $scope.pendingSong;
			$scope.currentSongIndex = $scope.pendingSongIndex;
			return false;
		}
		// up down
		else if (ev.which === 40) { //down
			if ($scope.pendingSongIndex === null) $scope.pendingSongIndex = 0;
			else $scope.pendingSongIndex++;
			ev.preventDefault();
		}
		else if (ev.which === 38) { //up
			//FIXME: the if puts the index on the bottom of the UNsorted list
			if ($scope.pendingSongIndex === null) $scope.pendingSongIndex = song_list_length;
			else $scope.pendingSongIndex--;
			ev.preventDefault();
		}
		else {return false;}

		// console.log($scope);
		// $scope.pendingSongIndex += num;
		// console.log($scope.currentSongIndex);
		if ($scope.pendingSongIndex > song_list_length){
			$scope.pendingSongIndex = 0;
		} else if ($scope.pendingSongIndex < 0) {
			$scope.pendingSongIndex = song_list_length;
		}
		console.log($scope.pendingSongIndex);
		$scope.pendingSong = $scope.filteredSongs[$scope.pendingSongIndex];
	};
});

songtrackerApp.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) {
            element[0].focus();
            scope[attrs.focusMe] = false;
        }
      });
    }
  };
});