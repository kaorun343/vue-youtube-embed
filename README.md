# Vue YouTube Embed
This is a component for Vue.js to utilize YouTube iframe API easily.
This is based on [Angular YouTube Embed](http://brandly.github.io/angular-youtube-embed/)

## License
MIT License

## install

```html
<script src="vue-youtube-embed.js"></script>
<script>
Vue.use(VueYouTubeEmbed)
</script>
```

or

```bash
// NPM
npm i -S vue-youtube-embed

// or with Yarn
yarn add vue-youtube-embed
```

```js
import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'
Vue.use(VueYouTubeEmbed)
// if you don't want install the component globally
Vue.use(VueYouTubeEmbed, { global: false })
```

## Usage
Please pass the ID of the video that you'd like to show.

```html
<youtube :video-id="videoId"></youtube>
```

### Props

These are available props.
* `player-width`: `String` or `Number`, default value is `640`
* `player-height`: `String` or `Number`, default value is `390`
* `player-vars`: `Object`, default value is `{start: 0, autoplay: 0}`
* `video-id`: `String`, `required`
* `mute`: `Boolean` default value is `false`

### Methods
These functions are the same as the original one.
* `getIdFromURL`
* `getTimeFromURL`

```js
import { getIdFromURL, getTimeFromURL } from 'vue-youtube-embed'
let videoId = getIdFromURL(url)
let startTime = getTimeFromURL(url)
```

or
```js
export default {
  methods: {
    method (url) {
      this.videoId = this.$youtube.getIdFromURL(url)
      this.startTime = this.$youtube.getTimeFromURL(url)
    }
  }
}
```

### Events
These are the events that will be emitted by the component.
* `ready`
* `ended`
* `playing`
* `paused`
* `buffering`
* `qued`
* `error`

The first argument is an instance of `YT.Player`.

### The way of start playing video automatically

```html
<youtube :player-vars="{ autoplay: 1 }"></youtube>
```

## Example on vue-play

```bash
// yarn or npm
yarn install
yarn run play
```

## Example code

```html
<div id="#app">
  <section>
    <h2>listening events</h2>
    <youtube :video-id="videoId" @ready="ready" @playing="playing"></youtube>
  </section>
  <section>
    <h2>add options</h2>
    <youtube :video-id="videoId" player-width="1280" player-height="750" :player-vars="{autoplay: 1}"></youtube>
  </section>
</div>
```

```js
'use strict'
import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'

Vue.use(VueYouTubeEmbed)

const app = new Vue({
  el: '#app',
  data: {
    videoId: 'videoId',
  },
  methods: {
    ready (player) {
      this.player = player
    },
    playing (player) {
      // The player is playing a video.
    },
    change () {
      // when you change the value, the player will also change.
      // If you would like to change `playerVars`, please change it before you change `videoId`.
      // If `playerVars.autoplay` is 1, `loadVideoById` will be called.
      // If `playerVars.autoplay` is 0, `cueVideoById` will be called.
      this.videoId = 'another video id'
    },
    stop () {
      this.player.stopVideo()
    },
    pause () {
      this.player.pauseVideo()
    }
  }
})
```

## Contribution
* contribution welcome!
