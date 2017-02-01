/*global window, videojs, my, defaults, trackList, widget*/
var transcript = function (options) {
  my.player = this;
  my.validTracks = trackList.get();
  my.currentTrack = trackList.active(my.validTracks);
  my.settings = videojs.mergeOptions(defaults, options);
  my.widget = widget.create(options);
  var timeUpdate = function () {
    my.widget.setCue(my.player.currentTime());
  };
  var updateTrack = function () {
    my.currentTrack = trackList.active(my.validTracks);
    my.widget.setTrack(my.currentTrack);
  };
  if (my.validTracks.length > 0) {
    updateTrack();
    my.player.on('timeupdate', timeUpdate);
    if (my.settings.followPlayerTrack) {
      my.player.on('captionstrackchange', updateTrack);
      my.player.on('subtitlestrackchange', updateTrack);
    }
  } else {
    throw new Error('videojs-transcript: No tracks found!');
  }
  return {
    el: function () {
      return my.widget.el();
    },
    setTrack: my.widget.setTrack
  };
};
videojs.plugin('transcript', transcript);
