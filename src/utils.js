/*
 *  Utils
 */

/*global my*/
var utils = (function (plugin) {
  return {
    secondsToTime: function (timeInSeconds) {
      var hour = Math.floor(timeInSeconds / 3600);
      var min = Math.floor(timeInSeconds % 3600 / 60);
      var sec = Math.floor(timeInSeconds % 60);
      sec = (sec < 10) ? '0' + sec : sec;
      min = (hour > 0 && min < 10) ? '0' + min : min;
      if (hour > 0) {
        return hour + ':' + min + ':' + sec;
      }
      return min + ':' + sec;
    },
    localize: function (string) {
      return string; // TODO: do something here;
    },
    createEl: function (elementName, classSuffix) {
      classSuffix = classSuffix || '';
      var el = document.createElement(elementName);
      el.className = plugin.prefix + classSuffix;
      return el;
    },
    extend: function(obj) {
      var type = typeof obj;
      if (!(type === 'function' || type === 'object' && !!obj)) {
        return obj;
      }
      var source, prop;
      for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
          obj[prop] = source[prop];
        }
      }
      return obj;
    }
  };
}(my));
