# Video.js Transcript

Creates interactive transcripts from text tracks.

## Warning

:no_entry: **Warning! This code is an early work in progress and contains bugs, typos, unimplemented features, debug cruft, and other defects. Don't use it yet.**  

### TODO:
- Seek video to transcript position when transcript is clicked
- Support setup options
- Nicer default CSS
- More CSS examples
- Handle multiple tracks
- Automatically switch caption track when user selects a different track on the video.
- Autoscrolling transcript
- Prevent autoscrolling when user is interacting with transcript (nice to have)
- More...

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

#### option
Type: `boolean`
Default: true

An example boolean option that has no effect.

## Release History

 - 0.1.0: Initial release
