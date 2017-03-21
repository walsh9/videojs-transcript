# Video.js Transcript

Creates interactive transcripts from text tracks.

## Alpha Release 3

Please report any issues or feature requests on the tracker. Thank you!

## Getting Started

Once you've added the plugin script to your page, you can use it with any video:

```html
<head>
<script src="video.js"></script>
<script src="videojs-transcript.js"></script>
</head>
<body>
<video id="video">
      <source src="whatever.webm" type="video/webm">
      <track kind="captions" src="mycaptions.srt" srclang="en" label="English" default>
</video>
<div id="transcript"></div>
<script>
    var video = videojs('video').ready(function(){
      // Set up any options.
      var options = {
        showTitle: false,
        showTrackSelector: false,
      };

      // Initialize the plugin.
      var transcript = this.transcript(options);

      // Then attach the widget to the page.
      var transcriptContainer = document.querySelector('#transcript');
      transcriptContainer.appendChild(transcript.el()); 
    }); 
</script>
</body>
```
There's also a [working example](https://walsh9.github.io/videojs-transcript/example.html) of the plugin you can check out if you're having trouble.

You'll also want to include one of the css files. 
You can style the plugin as you like but there are a few examples in the /css folder to get you started.

## Documentation
### Plugin Options

You may pass in an options object to the plugin upon initialization. This
object may contain any of the following properties:

#### autoscroll
**Default:** true

Set to false to disable autoscrolling.

#### scrollToCenter
**Default:** false

By default current row shows on the bottom on autoscrolling. Set to true to show it in the center
 
#### clickArea
**Default:** 'line'

Set which elements in the transcript are clickable.
Options are 'timestamp', 'text', the whole 'line', or 'none'.

#### showTitle
**Default:** true

Show a title with the transcript widget.

(Currently the title only says 'Transcript')

#### showTrackSelector
**Default:** true

Show a track selector with the transcript widget.

#### followPlayerTrack
**Default:** true

When you change the caption track on the video, the transcript changes tracks as well.

#### stopScrollWhenInUse
**Default:** true

Don't autoscroll the transcript when the user is trying to scroll it.

(This probably still has a few glitches to work out on touch screens and stuff right now)

### Plugin Methods
**el()**

Returns the DOM element containing the html transcript widget. You'll need to append this to your page.

## Release History

##### 0.8.0: Alpha Release 3

* Updated for video.js 5.x

##### 0.7.2: Alpha Release 2

* Updated for video.js 4.12

##### 0.7.1: Alpha Release 1

* First release
