/*! videojs-transcript - v0.0.0 - 2014-09-19
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
    return function (e) {
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
    myContainer.addEventListener('click', function (event) {
      var clickedClasses = event.target.classList;
      var clickedTime = event.target.getAttribute('data-begin') || event.target.parentElement.getAttribute('data-begin');
      if (clickedTime !== undefined && clickedTime !== null) { // can be zero
        if ((settings.clickArea === 'line') || // clickArea: 'line' activates on all elements 
             (settings.clickArea === 'timestamp' && clickedClasses.contains(myPrefix + '-timestamp')) ||
               (settings.clickArea === 'text' && clickedClasses.contains(myPrefix + '-text'))) {
          myPlayer.currentTime(clickedTime);
        }
      }
    });

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
var Scroller = (function () {

// Keep track when the user is scrolling the transcript.

  var userIsScrolling = false;

// Keep track of when the mouse is hovering the transcript.

  var mouseIsOverTranscript = false;

// The initial element creation triggers a scroll event. We don't want to consider 
// this as the user scrolling, so we initialize the isAutoScrolling flag to true.

  var isAutoScrolling = true;

// requestAnimationFrame compatibility shim.

  var requestAnimationFrame =
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame     ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };

// For smooth animation.

  var easeOut = function (time, start, change, duration) {
    return start + change * Math.sin(Math.min(1, time / duration) * (Math.PI / 2));
  };

// Animate the scrolling.

  var scrollTo = function (element, newPos, duration) {
    var startTime = Date.now();
    var startPos = element.scrollTop;

// Don't try to scroll beyond the limits. You won't get there and this will loop forever.

    newPos = Math.max(0, newPos);
    newPos = Math.min(element.scrollHeight - element.clientHeight, newPos);
    var change = newPos - startPos;

// This inner function is called until the elements scrollTop reaches newPos.

    var updateScroll = function () {
      var now = Date.now();
      var time = now - startTime;
      isAutoScrolling = true;
      element.scrollTop = easeOut(time, startPos, change, duration);
      if (element.scrollTop !== newPos) {
        requestAnimationFrame(updateScroll, element);
      }
    };
    requestAnimationFrame(updateScroll, element);
  };

// Scroll an element's parent so the element is brought into view. 

  var scrollToElement = function (element) {
    var parent = element.parentElement;
    var parentOffsetBottom = parent.offsetTop + parent.clientHeight;
    var elementOffsetBottom = element.offsetTop + element.clientHeight;
    var relPos = (element.offsetTop + element.clientHeight) - parent.offsetTop;
    var newPos;

// If the line is above the top of the parent view, were scrolling up, 
// so we want to move the top of the element downwards to match the top of the parent.

    if (relPos < parent.scrollTop) {
      newPos = element.offsetTop - parent.offsetTop;

// If the line is below the parent view, we're scrolling down, so we want the
// bottom edge of the line to move up to meet the bottom edge of the parent.

    } else if (relPos > (parent.scrollTop + parent.clientHeight)) {
      newPos = elementOffsetBottom - parentOffsetBottom;
    }

// Don't try to scroll if we haven't set a new position.  If we didn't
// set a new position the line is already in view (i.e. It's not above
// or below the view)
// And don't try to scroll when the element is already in position.

    if (newPos !== undefined && parent.scrollTop !== newPos) {
      scrollTo(parent, newPos, 400);
    }
  };

// Set Event Handlers to monitor user scrolling.

  var initHandlers = function (element) {

// The scroll event. We want to keep track of when the user is scrolling the transcript.

    element.addEventListener('scroll', function () {
      if (isAutoScrolling) {

// If isAutoScrolling was set to true, we can set it to false and then ignore this event.

        isAutoScrolling = false; // event handled
      } else {

// We only care about when the user scrolls. Set userIsScrolling to true and add a nice class.

        userIsScrolling = true;
        element.classList.add('is-inuse');
      }
    });

// The mouseover event.

    element.addEventListener('mouseover', function () {
      mouseIsOverTranscript = true;
    });
    element.addEventListener('mouseout', function () {
      mouseIsOverTranscript = false;

// Have a small delay before deciding user as done interacting.

      setTimeout(function () {

// Make sure the user didn't move the pointer back in. 

        if (!mouseIsOverTranscript) {
          userIsScrolling = false;
          element.classList.remove('is-inuse');
        }
      }, 1000);
    });
  };

// Return whether the element is scrollable.

  var canScroll = function (container) {
    return container.scrollHeight > container.offsetHeight;
  };

// Return whether the user is interacting with the transcript.

  var inUse = function () {
    return userIsScrolling;
  };

// Public Methods

  return {
    scrollToElement : scrollToElement,
    initHandlers : initHandlers,
    inUse : inUse,
    canScroll : canScroll,
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
            if (settings.autoscroll &&
                Scroller.canScroll(htmlContainer) &&
                !Scroller.inUse()) {
              Scroller.scrollToElement(caption.element);
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
      Scroller.initHandlers(htmlContainer);
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