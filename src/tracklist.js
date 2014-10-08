/*
 *  Tracklist Helper
 */

/*global my*/
var trackList = function (plugin) {
  var activeTrack;
  return {
    get: function () {
      var validTracks = [];
      my.tracks = my.player.textTracks();
      my.tracks.forEach(function (track) {
        if (track.kind() === 'captions' || track.kind() === 'subtitles') {
          validTracks.push(track);
        }
      });
      return validTracks;
    },
    active: function (tracks) {
      tracks.forEach(function (track) {
        if (track.mode() === 2) {
          activeTrack = track;
          return track;
        }
      });
      // fallback to first track
      return activeTrack || tracks[0];
    },
  };
}(my);
