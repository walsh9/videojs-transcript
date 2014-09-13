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