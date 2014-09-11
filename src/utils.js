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