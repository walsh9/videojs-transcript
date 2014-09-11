/*global window, videojs, Html, ScrollHelper, Utils*/
  var defaults = {
    autoscroll: true
  },
    transcript;
  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  transcript = function (options) {
    var settings = videojs.util.mergeOptions(defaults, options);
    var player = this;
    var htmlPrefix = 'transcript';
    var htmlContainer = document.createElement('div');
    var tracks;
    var currentTrack;
    var getAllTracks = function () {
      var i, kind;
      var validTracks = [];
      tracks = player.textTracks();
      for (i = 0; i < tracks.length; i++) {
        kind = tracks[i].kind();
        if (kind === 'captions' || kind === 'subtitles') {
          validTracks.push(tracks[i]);
        }
      }
      return validTracks;
    };
    var getDefaultTrack = function (tracks) {
      var i;
      for (i = 0; i < tracks.length; i++) {
        if (tracks[i].dflt && tracks[i].dflt()) {
          return tracks[i];
        }
      }
      return tracks[0];
    };
    var getCaptionNodes = function () {
      var i, node, caption;
      var nodes = document.querySelectorAll('#' + htmlContainer.id + ' > .' + htmlPrefix + '-line');
      var captions = [];
      for (i = 0; i < nodes.length; i++) {
        node = nodes[i];
        caption = {
          'element': node,
          'begin': node.getAttribute('data-begin'),
        };
        captions.push(caption);
      }
      return captions;
    };
    var timeUpdate = function () {
      var caption, end, i;
      var time = player.currentTime();
      var captions = getCaptionNodes();
      for (i = 0; i < captions.length; i++) {
        caption = captions[i];
        // Remain active until next caption.
        // On final caption, remain active until video duration if known, or forever;
        if (i < captions.length - 1) {
          end = captions[i + 1].begin;
        } else {
          end = player.duration() || Infinity;
        }
        if (time > caption.begin && time < end) {
          caption.element.classList.add('is-active');
          if (settings.autoscroll && ScrollHelper.isScrollable(htmlContainer)) {
            ScrollHelper.scrollIntoView(caption.element);
          }
        } else {
          caption.element.classList.remove('is-active');
        }
      }
    };
    tracks = getAllTracks();
    if (tracks.length > 0) {
      currentTrack = getDefaultTrack(tracks);
      Html.init(htmlContainer, player, htmlPrefix);
      Html.setTrack(currentTrack);
      this.on('timeupdate', timeUpdate);
    } else {
      throw new Error('videojs-transcript: No tracks found!');
    }
    var getContainer = function () {
      return htmlContainer;
    };
    return {
      getContainer: getContainer,
    };
  };
  // register the plugin
  videojs.plugin('transcript', transcript);

