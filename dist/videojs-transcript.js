/*! videojs-transcript - v0.0.0 - 2014-09-16
* Copyright (c) 2014 Matthew Walsh; Licensed MIT */
(function (window, videojs) {
  'use strict';


var Utils = (function () {
  var niceTimestamp = function (timeInSeconds) {
    var hour = Math.floor(timeInSeconds / 3600);
    var min = Math.floor(timeInSeconds % 3600 / 60);
    var sec = Math.floor(timeInSeconds % 60);
    sec = (sec < 10) ? '0' + sec : sec;
    min = (hour > 0 && min < 10) ? '0' + min : min;
    if (hour > 0) {
      return hour + ':' + min + ':' + sec;
    }
    return min + ':' + sec;
  };
  return {
    niceTimestamp : niceTimestamp,
  };
}());
var Html = (function () {
  var myContainer, myPlayer, myPrefix, settings;
  var createSeekClickHandler = function (time) {
    return function () {
      myPlayer.currentTime(time);
    };
  };
  var createLine = function (cue) {
    var line = document.createElement('div');
    var timestamp = document.createElement('span');
    var text = document.createElement('span');
    line.className = myPrefix + '-line';
    line.setAttribute('data-begin', cue.startTime);
    timestamp.className = myPrefix + '-timestamp';
    timestamp.textContent = Utils.niceTimestamp(cue.startTime);
    text.className = myPrefix + '-text';
    text.innerHTML = cue.text;
    line.appendChild(timestamp);
    line.appendChild(text);
    // Need to change to use single event handler on parent.
    switch (settings.clickArea) {
    case 'line':
      line.addEventListener('click', createSeekClickHandler(cue.startTime));
      break;
    case 'text':
      text.addEventListener('click', createSeekClickHandler(cue.startTime));
      break;
    case 'timestamp':
      timestamp.addEventListener('click', createSeekClickHandler(cue.startTime));
      break;
    default:
      break;
    }
    return line;
  };
  var setTrack = function (track) {
    if (myContainer === undefined) {
      throw new Error('videojs-transcript: Html not initialized!');
    }
    var line, i;
    var fragment = document.createDocumentFragment();
    var createTranscript = function () {
      var cues = track.cues();
      for (i = 0; i < cues.length; i++) {
        line = createLine(cues[i], myPrefix);
        fragment.appendChild(line);
      }
      myContainer.innerHTML = '';
      myContainer.appendChild(fragment);
      myContainer.setAttribute('lang', track.language());
    };
    if (track.readyState() !== 2) {
      track.load();
      track.on('loaded', createTranscript);
    } else {
      createTranscript();
    }
  };
  var init = function (container, player, prefix, options) {
    myContainer = container;
    myPlayer = player;
    myPrefix = prefix;
    settings = options;
    myContainer.className = prefix;
    myContainer.id = myPrefix + '-' + myPlayer.id();
  };
  return {
    init: init,
    setTrack: setTrack,
  };
}());
var ScrollHelper = (function () {
  'use strict';
  var isScrolling = false;
  var requestAnimationFrame =
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame     ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  var easeOut = function (time, start, change, duration) {
    return start + change * Math.sin(Math.min(1, time / duration) * (Math.PI / 2));
  };
  var scrollTo = function (element, newPos, duration) {
    var startTime = Date.now();
    var startPos = element.scrollTop;
    var change = newPos - startPos;
    newPos = Math.max(0, newPos);
    isScrolling = true;
    var updateScroll = function () {
      var now = Date.now();
      var time = now - startTime;
      element.scrollTop = easeOut(time, startPos, change, duration);
      if (element.scrollTop !== newPos) {
        requestAnimationFrame(updateScroll, element);
      } else {
        isScrolling = false;
      }
    };
    requestAnimationFrame(updateScroll, element);
  };

  var scrollUpIntoView = function (element) {
    // TODO: don't scroll while user is scrolling
    var parent = element.parentElement;
    var position = (element.offsetTop + element.clientHeight) - (parent.offsetTop + parent.clientHeight);
    var relpos = (element.offsetTop + element.clientHeight)  - parent.offsetTop;
    // Don't try to scroll when already visible. 
    // Don't try to scroll when already in position.
    if ((relpos < parent.scrollTop || relpos > (parent.scrollTop + parent.clientHeight)) &&
         parent.scrollTop !== position) {
      if (!isScrolling) {
        scrollTo(parent, position, 400);
      }
    }
  };
  var isScrollable = function (container) {
    return container.scrollHeight > container.offsetHeight;
  };
  return {
    scrollUpIntoView : scrollUpIntoView,
    isScrollable : isScrollable,
  };
}());
var Plugin = (function (window, videojs) {
  var defaults = {
    autoscroll: true,
    clickArea: 'line'
  };

  var transcript = function (options) {
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
    var getActiveTrack = function (tracks) {
      var i;
      for (i = 0; i < tracks.length; i++) {
        if (tracks[i].mode() === 2) {
          return tracks[i];
        }
      }
      return currentTrack || tracks[0];
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
          if (!caption.element.classList.contains('is-active')) { // don't update if it hasn't changed
            caption.element.classList.add('is-active');
            if (settings.autoscroll && ScrollHelper.isScrollable(htmlContainer)) {
              ScrollHelper.scrollUpIntoView(caption.element);
            }
          }
        } else {
          caption.element.classList.remove('is-active');
        }
      }
    };
    var trackChange = function () {
      currentTrack = getActiveTrack(tracks);
      Html.setTrack(currentTrack);
    };
    tracks = getAllTracks();
    if (tracks.length > 0) {
      Html.init(htmlContainer, player, htmlPrefix, settings);
      trackChange();
      player.on('timeupdate', timeUpdate);
      player.on('captionstrackchange', trackChange);
      player.on('subtitlestrackchange', trackChange);
    } else {
      throw new Error('videojs-transcript: No tracks found!');
    }
    var el = function () {
      return htmlContainer;
    };
    return {
      el: el,
      setTrack: trackChange,
    };
  };
  return {transcript: transcript};
}(window, videojs));

  videojs.plugin('transcript', Plugin.transcript);
}(window, window.videojs));