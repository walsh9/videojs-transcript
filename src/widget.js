/*
 *  Create and Manipulate DOM Widgets
 */

/*globals utils, eventEmitter, my, scrollable*/
var selectorWidget = function (plugin) {
  var on = function (event, callback) {
    eventEmitter.on(this, event, callback);
  };
  var trigger = function(event) {
    eventEmitter.trigger(this, event);
  };
  var create = function () {
    var select = utils.createEl('select', '-selector');
    plugin.validTracks.forEach(function (track, i) {
      var option = document.createElement('option');
      option.value = i;
      option.textContent = track.label() + ' (' + track.language() + ')';
      select.appendChild(option);
    });
    select.addEventListener('change', function (e) {
      trigger('change');
    });
    return select;
  };
  return {
    create: create,
    on: on
  };
}(my);

var transcriptWidget = function (plugin) {
  'use strict';

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
    var body = scrollable.create(utils.createEl('div', '-body'));
    var el = body.element;
    var line, i;
    var fragment = document.createDocumentFragment();
    var createTranscript = function () {
      var cues = track.cues();
      for (i = 0; i < cues.length; i++) {
        line = createLine(cues[i]);
        fragment.appendChild(line);
      }
      el.innerHTML = '';
      el.appendChild(fragment);
      el.setAttribute('lang', track.language());
    };
  };

  var createTitle = function () {
    var header = utils.createEl('header', '-header');
    header.textContent = utils.localize('Transcript');
    return header;
  };

  var createTranscript = function () {
    var el = document.createElement('div');
    plugin.el.setAttribute('id', plugin.prefix + '-' + plugin.player.id());
    var title = createTitle();
    var selector = selectorWidget.create();
    var body = createTranscriptBody(plugin.currentTrack);
    el.appendChild(title);
    el.appendChild(selector);
    el.appendChild(body.el);
    return el;
  };

  //need to implement these methods
  var setTrack = function () {

  };
  var setCue = function () {

  };
  var el = function () {

  };

  return {
    create: createTranscript,
    setTrack: setTrack,
    setCue: setCue,
    el : el
  };

}(my);
