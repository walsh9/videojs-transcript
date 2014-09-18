# Video.js Transcript

Creates interactive transcripts from text tracks.

## Warning

:no_entry: **Warning! This code is an early work in progress and contains bugs, typos, unimplemented features, debug cruft, and other defects. Don't use it yet.**  

### TODO:
- [x] Seek video to transcript position when transcript is clicked
- [ ] Add setup options
- [x] Nicer default CSS
- [ ] More CSS examples
- [x] Handle multiple tracks
- [x] Automatically switch caption track when user selects a different track on the video.
- [ ] Separate track switcher 
- [x] Autoscrolling transcript
- [x] *Smooth*, animated scrolling 
- [x] Clean up scrolling logic.
- [x] Prevent autoscrolling when user is interacting with transcript (nice to have)
- [ ] Tests!
- [ ] More...

## Getting Started

Once you've added the plugin script to your page, you can use it with any video:

```html
<script src="video.js"></script>
<script src="videojs-transcript.js"></script>
<script>
  videojs(document.querySelector('video')).transcript();
</script>
```

There's also a [working example](example.html) of the plugin you can check out if you're having trouble.

## Documentation
### Plugin Options

You may pass in an options object to the plugin upon initialization. This
object may contain any of the following properties:

#### autoscroll
**Default:** true

Set to false to disable autoscrolling.

#### clickArea
**Default:** 'line'

Set which elements in the transcript are clickable.
Options are 'timestamp', 'text', the whole 'line', or 'none'.

## Release History

 - 0.1.0: Initial release
