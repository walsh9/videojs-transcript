/*! videojs-transcript - v0.0.0 - 2014-9-8
 * Copyright (c) 2014 Matthew Walsh
 * Licensed under the MIT license. */
(function (window, videojs, qunit) {
  'use strict';

  var player,

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
      Flash = videojs.getComponent('Flash'),
      Html5 = videojs.getComponent('Html5'),
      backup = {
        Flash: {
          isSupported: Flash.isSupported
        },
        Html5: {
          isSupported: Html5.isSupported
        }
      };

  module('videojs-transcript', {
    setup: function() {
      // Force HTML5/Flash support.
      Html5.isSupported = Flash.isSupported = function() {
        return true;
      };

      // create a video element
      var video = document.createElement('video');
      document.querySelector('#qunit-fixture').appendChild(video);
      var track = document.createElement('track');
      video.appendChild(track);

      // create a video.js player
      player = videojs(video).ready(function(){
        // initialize the plugin with the default options
        this.transcript();
      });
      
    },
    teardown: function() {
      // Restore original state of the techs.
      Html5.isSupported = backup.Flash.isSupported;
      Flash.isSupported = backup.Html5.setSource;
    }
  });

  test('registers itself', function () {
    ok(player.transcript, 'registered the plugin');
  });
}(window, window.videojs, window.QUnit));
