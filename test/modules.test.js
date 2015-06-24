/*! videojs-transcript - v0.0.0 - 2014-9-8
 * Copyright (c) 2014 Matthew Walsh
 * Licensed under the MIT license. */
 /*global my, defaults, eventEmitter, trackList, scroller, widget*/
(function (window, videojs, qunit) {
  'use strict';

  var realIsHtmlSupported,
      player,

      // local QUnit aliases
      // http://api.qunitjs.com/

      // module(name, {[setup][ ,teardown]})
      module = qunit.module,
      // test(name, callback)
      test = qunit.test,
      // ok(value, [message])
      ok = qunit.ok,
      // equal(actual, expected, [message])
      equal = qunit.equal,
      // strictEqual(actual, expected, [message])
      strictEqual = qunit.strictEqual,
      // deepEqual(actual, expected, [message])
      deepEqual = qunit.deepEqual,
      // notEqual(actual, expected, [message])
      notEqual = qunit.notEqual,
      // throws(block, [expected], [message])
      throws = qunit.throws,
      expect = qunit.expect,
      asyncTest = qunit.asyncTest;

 /********************
  * test events.js
  ********************/
  module('events');

  test('Register and trigger event', function(assert) {
    expect(1);
    eventEmitter.on(this, 'test', function() {
      assert.ok(true, 'Event was triggered.');
    });
    eventEmitter.trigger(this, 'test');
  });

 /********************
  * test tracklist.js
  ********************/
  module('tracklist', {
    setup: function() {
      // force HTML support so the tests run in a reasonable
      // environment under phantomjs
      realIsHtmlSupported = videojs.Html5.isSupported;
      videojs.Html5.isSupported = function () {
        return true;
      };

      // create a video element
      var video = document.createElement('video');
      video.setAttribute('id', 'test-video');
      document.querySelector('#qunit-fixture').appendChild(video);

      var track = document.createElement('track');
      track.setAttribute('kind', 'captions');
      track.setAttribute('src', '../captions/captions.en.vtt');
      track.setAttribute('srclang', 'en');
      track.setAttribute('label', 'English');
      video.appendChild(track);

      var track2 = document.createElement('track');
      track2.setAttribute('kind', 'subtitles');
      track2.setAttribute('src', '../captions/captions.sv.vtt');
      track2.setAttribute('srclang', 'sv');
      track2.setAttribute('label', 'Swedish');
      video.appendChild(track2);

      // create a video.js player
      player = videojs(video);

      my.player = player;
    },
    teardown: function() {
      videojs.Html5.isSupported = realIsHtmlSupported;
    }
  });

  test('getTracks() returns list of tracks.', function (assert) {
    assert.equal(trackList.get().length, videojs.players['test-video'].textTracks().length, 'Tracklist length is correct');
  });

  test('active() returns the default track.', function (assert) {
    var tracks = trackList.get();
    assert.equal(trackList.active(tracks).label, 'English', 'Active track is defined');
  });

  test('active() returns active track after track change.', function (assert) {
    var tracks = trackList.get();
    videojs.players['test-video'].textTracks()[1].mode = 'showing';
    assert.equal(trackList.active(tracks).label, 'Swedish', 'Active track returns current track after track change.');
  });

 /********************
  * test scroller.js
  ********************/
  module('scroller');

  test('scroller() returns an object.', function (assert) {
    var container = document.querySelector('#scrollable-container');
    assert.notEqual(scroller(container), undefined, 'scroller is not undefined.');
  });

  test('canScroll() returns true when scrollable', function (assert) {
    var container = document.querySelector('#scrollable-container');
    container.scroll = scroller(container);
    assert.equal(container.scroll.canScroll(), true, 'canScroll returns true on scrollable container.');
  });

  test('canScroll() returns false when non-scrollable ', function (assert) {
    var container = document.querySelector('#non-scrollable-container');
    container.scroll = scroller(container);
    assert.equal(container.scroll.canScroll(), false, 'canScroll returns false on non-scrollable container.');
  });

  asyncTest('to() scrolls to correct location', function (assert) {
    expect(2);
    var container = document.querySelector('#scrollable-container');
    var item2 = document.querySelector('#item2');
    var item4 = document.querySelector('#item4');
    var initialScrollTop = container.scrollTop;
    container.scroll = scroller(container);
    container.scroll.to(item4);
    setTimeout(function () {
      assert.equal(container.scrollTop, initialScrollTop + 100, 'Container scrolls up by 100 pixels to reveal item4' );
      container.scroll.to(item2);
      setTimeout(function () {
        assert.equal(container.scrollTop, initialScrollTop + 50, 'Container scrolls down by 50 pixels to reveal item2' );
        qunit.start();
      },500);
    }, 500);
  });

}(window, window.videojs, window.QUnit));
