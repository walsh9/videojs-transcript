var ScrollHelper = (function () {
  var isScrollable = function (container) {
    return container.scrollHeight > container.offsetHeight;
  };
  var scrollIntoView = function (element) {
    // TODO: make this nice and smooth
    // TODO: don't scroll if line is already visible
    // TODO: don't scroll while user is scrolling
    element.scrollIntoView(false);
  };
  return {
    isScrollable : isScrollable,
    scrollIntoView : scrollIntoView
  };
}());