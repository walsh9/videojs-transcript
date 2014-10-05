/*
 *  Create and Manipulate DOM Widgets
 */

/*globals utils, eventEmitter, my, scrollable*/

var widget = function (plugin) {
  var element = {};
  var body = {};
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
    //console.log(track.cues());
    if (typeof track !== 'object') {
      track = plugin.player.textTracks()[track];
    }
    var body = utils.createEl('div', '-body');
    var line, i;
    var fragment = document.createDocumentFragment();
    var createTranscript = function () {
      console.log(track);
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
    el.setAttribute('id', plugin.prefix + '-' + plugin.player.id());
    var title = createTitle();
    var selector = createSelector();
    this.body = createTranscriptBody(plugin.currentTrack);
    el.appendChild(title);
    el.appendChild(selector);
    el.appendChild(this.body);
    this.element = el;
    return this;
  };
  var setTrack = function (track) {
    this.body = createTranscriptBody(track);
  };
  var setCue = function () {
  //need to implement
  };
  var el = function () {
    return this.element;
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
