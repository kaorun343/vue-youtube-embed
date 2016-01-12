# Vue YouTube Embed
This is a directive for Vue.js to utilize YouTube iframe API easily.
This is based on [Angular YouTube Embed](http://brandly.github.io/angular-youtube-embed/)

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## install
```
npm install --save vue-youtube-embed
```

## Requirement
* Vue.js
* [String.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes)

## How to Use
Please pass the ID of the video that you'd like to show.
`getIdFromURL` is available when you'd like to get the ID from url.
This function is the same as the original one. Also, `getTimeFromURL` is the same  as the original one, too.

Currently, `width` and `height` is available to pass to the directive.
Please pass them as `String`.
These are available params.
* width: default value is `640`
* height: String, default value is `390`
* play: whether play video when videoId is changed, default value is `false`

These are the events that will be emitted by the directive.
* `READY`: 'youtube.player.ready',
* `ENDED`: 'youtube.player.ended',
* `PLAYING`: 'youtube.player.playing',
* `PAUSED`: 'youtube.player.paused',
* `BUFFERING`: 'youtube.player.buffering',
* `QUEUED`: 'youtube.player.queued',
* `ERROR`: 'youtube.player.error'

## Example

```html
<div id="#app">
  <div>
    <h2>normal</h2>
    <div v-youtube="videoId"></div>
  </div>
  <div>
    <h2>add params</h2>
    <div v-youtube="videoId" width="1280" height="750" :play="true"></div>
  </div>
</div>
```

```js
import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'
Vue.use(VueYouTubeEmbed)

const {events, getIdFromURL} = VueYouTubeEmbed
let videoId = getIdFromURL(someYouTubeUrl)


const app = new Vue({
  el: '#app',
  data: {
    videoId: videoId
  },
  events: {
    // when player is ready, the directive emit 'events.READY'
    // "player" is instance of YT.Player
    [events.READY]: function(player) {
      // I think it's good to add the player to the component directly.
      // You shouldn't use "this.$set" or prepare the key at "data"
      this.player = player
    },
    // when player's state is changed,
    // the directive check the state and emit 'events.PLAYING' or else
    [events.PLAYING]: function(player) {
    },
    'youtube.player.ended': function(player) {
    }
  },
  methods: {
    change() {
      // when you change the value, the player will also change.
      this.videoId = 'another video id'
    },
    stop() {
      this.player.stopVideo()
    },
    pause() {
      this.player.pauseVideo()
    }
  }
})
```

## Development
* contribution welcome
