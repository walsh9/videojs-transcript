/*! videojs-transcript - v0.0.0 - 2014-9-8
 * Copyright (c) 2014 Matthew Walsh
 * Licensed under the MIT license. */
(function(window, videojs) {
  'use strict';

  var defaults = {
        option: true
      },
      transcript;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  transcript = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options),
        player = this;

    // TODO: write some amazing plugin code
  };

  // register the plugin
  videojs.plugin('transcript', transcript);
})(window, window.videojs);
