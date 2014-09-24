/*
 *  Create and Manipulate Html Elements
 */
var html;

html.createEl = function (elementName, classSuffix) {
  classSuffix = classSuffix || '';
  var el = document.createElement(elementName);
  el.className = prefix_ + classSuffix;
  return el;
};

html.createLine = function (cue) {
  var line = html.createEl('div', '-line');
  var timestamp = html.createEl('span', '-timestamp')
  var text = html.createEl('span', '-text');
  line.setAttribute('data-begin', cue.startTime);
  timestamp.textContent = utils.secondsToTime(cue.startTime);
  text.innerHTML = cue.text;
  line.appendChild(timestamp);
  line.appendChild(text);
  return line;
};

html.createTranscriptBody = function (track) {
  if (typeof track !== 'object') {
    track = player_.textTracks()[track];
  }
  var body = createScrollable(html.createEl('div', '-body'));
  var el = body.element;
  var line, i;
  var fragment = document.createDocumentFragment();
  var createTranscript = function () {
    var cues = track.cues();
    for (i = 0; i < cues.length; i++) {
      line = html.createLine(cues[i]);
      fragment.appendChild(line);
    }
    el.innerHTML = '';
    el.appendChild(fragment);
    el.setAttribute('lang', track.language());
  };
  el.addEventListener('click', function (event) {
    var clickedClasses = event.target.classList;
    var clickedTime = event.target.getAttribute('data-begin') || event.target.parentElement.getAttribute('data-begin');
    if (clickedTime !== undefined && clickedTime !== null) { // can be zero
      if ((settings_.clickArea === 'line') || // clickArea: 'line' activates on all elements
           (settings_.clickArea === 'timestamp' && clickedClasses.contains(prefix_ + '-timestamp')) ||
             (settings_.clickArea === 'text' && clickedClasses.contains(prefix_ + '-text'))) {
        player_.currentTime(clickedTime);
      }
    }
  });
  if (track.readyState() !== 2) {
    track.load();
    track.on('loaded', createTranscript);
  } else {
    createTranscript();
  }
  return el;
};

html.createTitle = function () {
  var header = html.createEl('header', '-header');
  header.textContent = utils.localize('Transcript');
  return header;
};

html.createSelector = function () {
  var select = html.createEl('select', '-selector');
  var i, track, option;
  for (i = 0; i < tracks.length; i++) {
    track = validTracks_[i];
    option = document.createElement('option');
    option.value = i;
    option.textContent = track.label() + ' (' + track.language() + ')';
    select.appendChild(option);
  }
  select.addEventListener('change', function (e) {
    html.replaceTranscriptBody(document.querySelector('#' + prefix_ + '-' + player_.id() + '-selector option:checked').value);
  });
  return select;
};

html.createTranscript = function () {
  var el = document.createElement('div');
  var elsetAttribute('id', prefix_ + '-' + player_.id());
  var title = html.createTitle();
  var selector = html.createSelector();
  var body = html.createTranscriptBody(currentTrack_);
  el.appendChild(title);
  el.appendChild(selector);
  el.appendChild(body);
  return el;
};

html.replaceTranscriptBody = function (track) {
  var oldbody = document.querySelector('#' + prefix_ + '-' + player_.id());
  var newbody = html.createTranscriptBody(track);
  oldbody.parent.replaceChild(newbody, oldbody);
}
