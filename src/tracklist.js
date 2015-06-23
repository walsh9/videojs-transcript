/*
 *  Tracklist Helper
 */

/*global my*/
var trackList = function (plugin) {
  var activeTrack;
  return {
    get: function () {
      var validTracks = [];
      var i, track;
      my.tracks = my.player.textTracks();
      for (i = 0; i < my.tracks.length; i++) {
        track = my.tracks[i];
        if (track.kind === 'captions' || track.kind === 'subtitles') {
          validTracks.push(track);
        }
      }
      return validTracks;
    },
    active: function (tracks) {
      var i, track;
      for (i = 0; i < my.tracks.length; i++) {
        track = my.tracks[i];
        if (track.mode === 'showing') {
          activeTrack = track;
          return track;
        }
      }
      // fallback to first track
      return activeTrack || tracks[0];
    },
  };
}(my);
