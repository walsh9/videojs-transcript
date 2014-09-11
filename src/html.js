/*global Utils*/
var Html = (function () {
  var myContainer, myPlayer, myPrefix;
  var createSeekClickHandler = function (time) {
    return function () {
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
    line.addEventListener('click', createSeekClickHandler(cue.startTime));
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
    track.load();
    track.on('loaded', function () {
      //console.log('Creating transcript with ' + track.cues().length + ' lines.');
      var cues = track.cues();
      for (i = 0; i < cues.length; i++) {
        line = createLine(cues[i], myPrefix);
        fragment.appendChild(line);
      }
      myContainer.appendChild(fragment);
      myContainer.setAttribute('lang', track.language());
    });
  };
  var init = function (container, player, prefix) {
    myContainer = container;
    myPlayer = player;
    myPrefix = prefix;
    myContainer.className = prefix;
    myContainer.id = myPrefix + '-' + myPlayer.id();
  };
  return {
    init: init,
    setTrack: setTrack,
  };
}());