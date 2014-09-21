/*global Utils*/
var Html = (function () {
  var myContainer, subContainer, myPlayer, myPrefix, settings;
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
    if (typeof track !== 'object') {
      track = myPlayer.textTracks()[track];
    }
    if (subContainer === undefined) {
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
      subContainer.innerHTML = '';
      subContainer.appendChild(fragment);
      subContainer.setAttribute('lang', track.language());
    };
    subContainer.addEventListener('click', function (event) {
      var clickedClasses = event.target.classList;
      var clickedTime = event.target.getAttribute('data-begin') || event.target.parentElement.getAttribute('data-begin');
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
  var createSelector = function (tracks) {
    var select =  document.createElement('select');
    var i, track, option;
    for (i = 0; i < tracks.length; i++) {
      track = tracks[i];
      option = document.createElement('option');
      option.value = i;
      option.textContent = track.label() + ' (' + track.language() + ')';
      select.appendChild(option);
    }
    select.addEventListener('change', function (e) {
      setTrack(document.querySelector('#' + myPrefix + '-' + myPlayer.id() + ' option:checked').value);
    });
    return select;
  };
  var init = function (container, player, prefix, plugin) {
    myContainer = container;
    myPlayer = player;
    myPrefix = prefix;
    subContainer = document.createElement('div');
    settings = plugin.options;
    myContainer.className = prefix;
    subContainer.className = prefix + '-lines';
    myContainer.id = myPrefix + '-' + myPlayer.id();
    myContainer.appendChild(createSelector(myPlayer.textTracks()));
    myContainer.appendChild(subContainer);
  };
  return {
    init: init,
    setTrack: setTrack,
  };
}());