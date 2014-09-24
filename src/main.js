/*global window, videojs*/

  var defaults = {
    autoscroll: true,
    clickArea: 'line'
  };

  var transcript = function (options) {
    var settings_ = videojs.util.mergeOptions(defaults, options);
    var getAllTracks = function () {
      var i, kind;
      var validTracks = [];
      var tracks = player_.textTracks();
      for (i = 0; i < tracks.length; i++) {
        kind = tracks[i].kind();
        if (kind === 'captions' || kind === 'subtitles') {
          validTracks.push(tracks[i]);
        }
      }
      return validTracks;
    };
    var getActiveTrack = function (tracks) {
      var i;
      for (i = 0; i < tracks.length; i++) {
        if (tracks[i].mode() === 2) {
          return tracks[i];
        }
      }
      return currentTrack_ || tracks[0];
    };
    var getCaptionNodes = function () {
      var i, node, caption;
      var nodes = document.querySelectorAll('#' + el_.id + ' > .' + prefix_ + '-line');
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
      var time = player_.currentTime();
      var captions = getCaptionNodes();
      for (i = 0; i < captions.length; i++) {
        caption = captions[i];
        // Remain active until next caption.
        // On final caption, remain active until video duration if known, or forever;
        if (i < captions.length - 1) {
          end = captions[i + 1].begin;
        } else {
          end = player_.duration() || Infinity;
        }
        if (time > caption.begin && time < end) {
          if (!caption.element.classList.contains('is-active')) { // don't update if it hasn't changed
            caption.element.classList.add('is-active');
            // if (settings.autoscroll &&
            //     Scroller.canScroll(htmlContainer) &&
            //     !Scroller.inUse()) {
            //   Scroller.scrollToElement(caption.element);
            // }
          }
        } else {
          caption.element.classList.remove('is-active');
        }
      }
    };
    validTracks_ = getAllTracks();
    var trackChange = function () {
      currentTrack_ = getActiveTrack(validTracks_);
      html.replaceTranscriptBody(currentTrack_)
    };
    if (validTracks_.length > 0) {
      el_ = html.createTranscript;
      trackChange();
      player_.on('timeupdate', timeUpdate);
      player_.on('captionstrackchange', trackChange);
      player_.on('subtitlestrackchange', trackChange);
    } else {
      throw new Error('videojs-transcript: No tracks found!');
    }
    var el = function () {
      return el_;
    };
    return {
      el: el,
      setTrack: trackChange,
      options: options_,
    };
  };
  videojs.plugin('transcript', transcript);
}(window, videojs));
