var Scroller = (function () {
  'use strict';

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
    newPos = Math.min(element.scrollHeight, newPos);
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

// Scroll an element so it's bottom edge meets the bottom edge of it's parent.  This should look good when moving downwards.

  var scrollToElement = function (element) {
    var parent = element.parentElement;
    var position = (element.offsetTop + element.clientHeight) - (parent.offsetTop + parent.clientHeight);
    var relpos = (element.offsetTop + element.clientHeight)  - parent.offsetTop;

// Don't try to scroll when already visible. 
// Don't try to scroll when already in position.

    if ((relpos < parent.scrollTop || relpos > (parent.scrollTop + parent.clientHeight)) &&
         parent.scrollTop !== position) {
      scrollTo(parent, position, 400);
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