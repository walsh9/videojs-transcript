/*global window, videojs, my, defaults, trackList, transcriptWidget*/
var transcript = function (options) {
  my.player = this;
  my.validTracks = trackList.get();
  my.settings = videojs.util.mergeOptions(defaults, options);
  my.widget = transcriptWidget.create();
  var timeUpdate = function () {
    my.widget.setCue(my.player.currentTime());
  };
  var updateTrack = function () {
    my.currentTrack = trackList.active();
    my.widget.setTrack(my.currentTrack);
  };
  if (my.validTracks.length > 0) {
    updateTrack();
    my.player.on('timeupdate', timeUpdate);
    my.player.on('captionstrackchange', updateTrack);
    my.player.on('subtitlestrackchange', updateTrack);
  } else {
    throw new Error('videojs-transcript: No tracks found!');
  }
  return {
    el: my.widget.el,
    setTrack: my.widget.setTrack,
  };
};
videojs.plugin('transcript', transcript);
