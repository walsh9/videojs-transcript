/*
 *  Compatibility Shims
 */

/* requestAnimationFrame polyfill */
var requestAnimationFrame =
  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame     ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

/*Object.create Shim*/
if (!Object.create) {
  Object.create = function (o) {
    if (arguments.length > 1) {
        throw new Error('Object.create implementation only accepts the first parameter.');
    }
    function F() {}
    F.prototype = o;
    return new F();
  };
}