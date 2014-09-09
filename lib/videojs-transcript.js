/*! videojs-transcript - v0.0.0 - 2014-9-8
 * Copyright (c) 2014 Matthew Walsh
 * Licensed under the MIT license. */

(function(window, videojs) {
  'use strict';

  var defaults = {
        option: true
      },
      transcript;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  transcript = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options);
    var player = this;
    var htmlPrefix = 'transcript';
    var htmlContainer;
    var tracks;
    var currentTrack;
    var getAllTracks = function () {
      var tracks = player.textTracks();
      var validTracks = [];
      for (var i = 0; i < tracks.length; i++) {
        var kind = tracks[i].kind();
        if (kind === 'captions' || kind === 'subtitles') {
          validTracks.push(tracks[i]);
        }
      }
      return validTracks;
    };
    var getDefaultTrack = function (tracks) {
      for (var i = 0; i < tracks.length; i++) {
        if (tracks[i].dflt && tracks[i].dflt()) {
          return tracks[i];
        }
        return tracks[0];
      }
    };
    var getCaptionNodes = function () {
      var nodes = document.querySelectorAll('#' + htmlContainer.id + ' > .' + htmlPrefix + '-line');
      var captions = [];
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var caption = { 'element': node,
          'begin': node.getAttribute('data-begin'),
          'end': node.getAttribute('data-end') 
        };
        captions.push(caption);
      }
      return captions;
    };
    var timeUpdate = function (e) {
      var time = player.currentTime();
      var captions = getCaptionNodes();      
      for (var i = 0; i < captions.length; i++) {
        var caption = captions[i];
        // Remain active until next caption.
        // On final caption, remain active until video duration if known, otherwise 10 more seconds;
        var next = captions[i+1] || { begin: player.duration() || caption.end + 10 }; 
        if (time > caption.begin && time < next.begin) {
          caption.element.classList.add('is-active');
        } else {
          caption.element.classList.remove('is-active');
        }
      }
    };
    var initContainer = function (track) {
      htmlContainer = document.createElement('div');
      htmlContainer.className = htmlPrefix;
      htmlContainer.id = htmlPrefix + '-' + player.id();
      htmlContainer.setAttribute('lang', track.language());
    };
    var createTranscript = function (track) {
      var fragment = document.createDocumentFragment();
      track.load();
      track.on('loaded', function () {
        console.log('Creating transcript with ' + track.cues().length + ' lines.');
        var cues = track.cues();
        for (var i = 0; i < cues.length; i++) {
          var line = createLine(cues[i]);
          fragment.appendChild(line);
        }
        htmlContainer.appendChild(fragment);
      });
    };
    var niceTimestamp = function (timeInSeconds) {
      var hour = Math.floor(timeInSeconds / 3600);
      var min = Math.floor(timeInSeconds % 3600 / 60);
      var sec = Math.floor(timeInSeconds % 60);
      sec = (sec < 10) ? '0' + sec : sec;
      min = (hour > 0 && min < 10) ? '0' + min : min;
      if (hour > 0) {
        return hour + ':' + min + ':' + sec;
      } else {
        return min + ':' + sec;
      }
    };
    var createLine = function(cue) {
      var line = document.createElement('div');
      var timestamp = document.createElement('span');
      var text = document.createElement('span');
      line.className = htmlPrefix + '-line';
      line.setAttribute('data-begin', cue.startTime);
      line.setAttribute('data-end', cue.endTime || cue.xa);
      timestamp.className = htmlPrefix + '-timestamp';
      timestamp.textContent = niceTimestamp(cue.startTime);
      text.className = htmlPrefix + '-text';
      text.innerHTML = cue.text;
      line.appendChild(timestamp);
      line.appendChild(text);
      return line;
    };
    var getContainer = function () {
      return htmlContainer;
    };
    tracks = getAllTracks();
    if (tracks.length > 0) {
      currentTrack = getDefaultTrack(tracks);
      initContainer(currentTrack);
      createTranscript(currentTrack);
      this.on('timeupdate', timeUpdate);
    } else {
      console.log('videojs-transcript: No tracks found!');
    }
    return{
      getContainer: getContainer,
    };
  };

  // register the plugin
  videojs.plugin('transcript', transcript);
})(window, window.videojs);
