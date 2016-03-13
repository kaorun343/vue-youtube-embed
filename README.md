# Vue YouTube Embed
This is a directive for Vue.js to utilize YouTube iframe API easily.
This is based on [Angular YouTube Embed](http://brandly.github.io/angular-youtube-embed/)

## License
MIT License

## install
```bash
npm install --save vue-youtube-embed
```

```js
'use strict'
import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'
Vue.use(VueYouTubeEmbed)
```

## Requirement
* Vue.js

## Usage

### Directive and Modifiers
Please pass the ID of the video that you'd like to show.

```html
<div v-youtube="videoId"></div>
<div v-youtube.literal="rawVideoId"></div>
```
However, you can pass the url of the video instead of the id like this.
The url can include start time.

```html
<div v-youtube.url="videoUrl"></div>
<div v-youtube.url.literal="rawVideoUrl"></div>
```

### Params
These are available params.
* `width`: `String`, default value is `640`
* `height`: `String`, default value is `390`
* `playerVars`: `Object`, default value is `{start: 0}`

### Methods
These functions are the same as the original one.
* `getIdFromURL`
* `getTimeFromURL`

```js
'use strict'
import VueYouTubeEmbed from 'vue-youtube-embed'
let videoId = VueYouTubeEmbed.getIdFromURL(url)
let startTime = VueYouTubeEmbed.getTimeFromURL(url)
```

or
```js
'use strict'
export default {
  methods: {
    method(url) {
      this.videoId = this.$youtube.getIdFromURL(url)
      this.startTime = this.$youtube.getTimeFromURL(url)
    }
  }
}
```

### Events
These are the events that will be emitted by the directive.
* `READY`: `youtube:player:ready`
* `ENDED`: `youtube:player:ended`
* `PLAYING`: `youtube:player:playing`
* `PAUSED`: `youtube:player:paused`
* `BUFFERING`: `youtube:player:buffering`
* `QUEUED`: `youtube:player:queued`
* `ERROR`: `youtube:player:error`

## Example

```html
<div id="#app">
  <div>
    <h2>normal</h2>
    <div v-youtube="videoId"></div>
  </div>
  <div>
    <h2>add params</h2>
    <div v-youtube="videoId" width="1280" height="750" :player-vars="{autoplay: 1}"></div>
  </div>
  <div>
    <h2>url instead of video url</h2>
    <div v-youtube.url="videoUrl"></div>
  </div>
</div>
```

```js
'use strict'
import Vue from 'vue'
import VueYouTubeEmbed, { events } from 'vue-youtube-embed'

Vue.use(VueYouTubeEmbed)

const app = new Vue({
  el: '#app',
  data: {
    videoId: 'videoId',
    videoUrl: 'https://youtu.be/videoId?t=20s'
  },
  events: {
    // when player is ready, the directive emit 'events.READY'
    // "player" is an instance of YT.Player
    [events.READY]: function(player) {
      // I think it's good to add the player to the component directly.
      // You shouldn't use "this.$set" or prepare the key at "data"
      this.player = player
    },
    // when player's state is changed,
    // the directive check the state and emit 'events.PLAYING' or else
    [events.PLAYING]: function(player) {
    },
    'youtube:player:ended': function(player) {
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

## Projects without webpack
If you are not using webpack you need to import the plugin as follows:

```js
import {install as VouYoutubeEmbed} from 'vue-youtube-embed'
Vue.use(VouYoutubeEmbed)

...
```


## Contribution
* contribution welcome!
