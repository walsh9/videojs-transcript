/*global Utils*/
var Html = (function () {
  var myContainer, myPlayer, myPrefix, settings;
  var createSeekClickHandler = function (time) {
    return function (e) {
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
    var createTranscript = function () {
      var cues = track.cues();
      for (i = 0; i < cues.length; i++) {
        line = createLine(cues[i], myPrefix);
        fragment.appendChild(line);
      }
      myContainer.innerHTML = '';
      myContainer.appendChild(fragment);
      myContainer.setAttribute('lang', track.language());
    };
    myContainer.addEventListener('click', function (e) {
      var clickedClasses = e.target.classList;
      var clickedTime = e.target.getAttribute('data-begin') || e.target.parentElement.getAttribute('data-begin');
      if (clickedTime !== undefined && clickedTime !== null) { // can be zero
        if ((settings.clickArea === 'line') || // clickArea: 'line' activates on all elements 
             (settings.clickArea === 'timestamp' && clickedClasses.contains(myPrefix + '-timestamp')) ||
               (settings.clickArea === 'text' && clickedClasses.contains(myPrefix + '-text'))) {
          myPlayer.currentTime(clickedTime);
        }
      }
    });
    if (track.readyState() !== 2) {
      track.load();
      track.on('loaded', createTranscript);
    } else {
      createTranscript();
    }
  };
  var init = function (container, player, prefix, options) {
    myContainer = container;
    myPlayer = player;
    myPrefix = prefix;
    settings = options;
    myContainer.className = prefix;
    myContainer.id = myPrefix + '-' + myPlayer.id();
  };
  return {
    init: init,
    setTrack: setTrack,
  };
}());