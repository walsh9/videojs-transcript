/*
 *  Basic event handling.
 */

var eventEmitter = {
  handlers_: [],
  on: function on (object, eventtype, callback) {
    if (typeof callback === 'function') {
      this.handlers_.push([object, eventtype, callback]);
    } else {
      throw new TypeError('Callback is not a function.');
    }
  },
  trigger: function trigger (object, eventtype) {
    this.handlers_.forEach( function(h) {
      if (h[0] === object &&
          h[1] === eventtype) {
            h[2].apply();
      }
    });
  },
  delegate: function (obj) {
    obj.on = function (event, callback) {
      eventEmitter.on(obj, event, callback);
    };
    obj.trigger = function (obj) {
      eventEmitter.trigget(obj, event);
    };
    return obj;
  }
};
