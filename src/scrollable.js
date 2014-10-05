/*
 *  Scrollable class to handle scrolling.
 *  Need to clean up some unneccesarily exposed methods later...
 */

/*global my, utils*/
var scrollable = function (plugin) {
'use strict';
  var scrollablePrototype = {
    easeOut: function (time, start, change, duration) {
      return start + change * Math.sin(Math.min(1, time / duration) * (Math.PI / 2));
    },

    // Animate the scrolling.
    scrollTo: function (element, newPos, duration) {
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
        this.isAutoScrolling = true;
        element.scrollTop = this.easeOut(time, startPos, change, duration);
        if (element.scrollTop !== newPos) {
          requestAnimationFrame(updateScroll, element);
        }
      };
      requestAnimationFrame(updateScroll, element);
    },
      // Scroll an element's parent so the element is brought into view.
      scrollToElement: function (element) {
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
      },

      initHandlers: function () {
        var el = this.element;
        // The scroll event. We want to keep track of when the user is scrolling the transcript.
        el.addEventListener('scroll', function () {
          if (this.isAutoScrolling) {

            // If isAutoScrolling was set to true, we can set it to false and then ignore this event.
            this.isAutoScrolling = false; // event handled
          } else {

            // We only care about when the user scrolls. Set userIsScrolling to true and add a nice class.
            this.userIsScrolling = true;
            el.classList.add('is-inuse');
          }
        });

        // The mouseover event.
        el.addEventListener('mouseover', function () {
          this.mouseIsOverTranscript = true;
        });
        el.addEventListener('mouseout', function () {
          this.mouseIsOverTranscript = false;

          // Have a small delay before deciding user as done interacting.
          setTimeout(function () {

            // Make sure the user didn't move the pointer back in.
            if (!this.mouseIsOverTranscript) {
              this.userIsScrolling = false;
              el.classList.remove('is-inuse');
            }
          }, 1000);
        });
      },

      // Return whether the element is scrollable.
      canScroll: function () {
        var el = this.element;
        return el.scrollHeight > el.offsetHeight;
      },

      // Return whether the user is interacting with the transcript.
      inUse: function () {
        return this.userIsScrolling;
      },
      el: function () {
        return this.element;
      },
  };
  //Factory function
  var createScrollable = function (element) {
    var ob = Object.create(scrollablePrototype)
    console.log(ob);
    utils.extend(ob, {
      element: element,
      userIsScrolling : false,
      mouseIsOver: false,
      isAutoScrolling: true,
    });
    console.log(ob);
    return ob;
  };
  return {
    create: createScrollable
  };
}(my);

