/*
 *  Create and Manipulate DOM Widgets
 */

/*globals utils, eventEmitter, my, scrollable*/

var widget = function (plugin) {
  var my = {};
  my.element = {};
  my.body = {};
  var on = function (event, callback) {
    eventEmitter.on(this, event, callback);
  };
  var trigger = function (event) {
    eventEmitter.trigger(this, event);
  };
  var createTitle = function () {
    var header = utils.createEl('header', '-header');
    header.textContent = utils.localize('Transcript');
    return header;
  };
  var createSelector = function (){
    var selector = utils.createEl('select', '-selector');
      plugin.validTracks.forEach(function (track, i) {
      var option = document.createElement('option');
      option.value = i;
      option.textContent = track.label() + ' (' + track.language() + ')';
      selector.appendChild(option);
    });
    selector.addEventListener('change', function (e) {
      setTrack(document.querySelector('#' + plugin.prefix + '-' + plugin.player.id() + ' option:checked').value);
      trigger('trackchanged');
    });
    return selector;
  };
  var createLine = function (cue) {
    var line = utils.createEl('div', '-line');
    var timestamp = utils.createEl('span', '-timestamp');
    var text = utils.createEl('span', '-text');
    line.setAttribute('data-begin', cue.startTime);
    timestamp.textContent = utils.secondsToTime(cue.startTime);
    text.innerHTML = cue.text;
    line.appendChild(timestamp);
    line.appendChild(text);
    return line;
  };
  var createTranscriptBody = function (track) {
    if (typeof track !== 'object') {
      track = plugin.player.textTracks()[track];
    }
    var body = utils.createEl('div', '-body');
    var line, i;
    var fragment = document.createDocumentFragment();
    var createTranscript = function () {
      var cues = track.cues();
      for (i = 0; i < cues.length; i++) {
        line = createLine(cues[i]);
        fragment.appendChild(line);
      }
      body.innerHTML = '';
      body.appendChild(fragment);
      body.setAttribute('lang', track.language());
    };
    if (track.readyState() !==2) {
      track.load();
      track.on('loaded', createTranscript);
    } else {
      createTranscript();
    }
    return body;
  };
  var create = function () {
    var el = document.createElement('div');
    my.element = el;
    el.setAttribute('id', plugin.prefix + '-' + plugin.player.id());
    var title = createTitle();
    el.appendChild(title);
    var selector = createSelector();
    el.appendChild(selector);
    my.body = utils.createEl('div', '-body');
    el.appendChild(my.body);
    setTrack(plugin.currentTrack);
    return this;
  };
  var setTrack = function (track) {
    var newBody = createTranscriptBody(track);
    my.element.insertBefore(newBody, my.body);
    my.element.removeChild(my.body);
    my.body = newBody;
  };
  var setCue = function () {
  //need to implement
  };
  var el = function () {
    return my.element;
  };
  return {
    create: create,
    setTrack: setTrack,
    setCue: setCue,
    el : el,
    on: on,
    trigger: trigger,
  };

}(my);
