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