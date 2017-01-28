'use strict'

import { getIdFromURL, getTimeFromURL } from './utils'
import container from './container'

let pid = 0

export const YouTubePlayer = {
  props: ['playerHeight', 'playerWidth', 'playerVars', 'videoId'],
  render (h) {
    return h('div', [
      h('div', { attrs: { id: this.elementId }})
    ])
  },
  template: '<div><div :id="elementId"></div></div>',
  watch: {
    playerWidth: 'setSize',
    playerHeight: 'setSize',
    videoId: 'update'
  },
  data() {
    pid += 1
    return {
      elementId: `youtube-player-${pid}`,
      player: {}
    }
  },
  methods: {
    setSize() {
      this.player.setSize(this.playerWidth || '640', this.playerHeight || '390')
    },
    update(videoId) {
      const {
        playerVars = {autoplay: 0}
      } = this
      const name = `${playerVars.autoplay ? 'load' : 'cue'}VideoById`
      if (this.player.hasOwnProperty(name)) {
        this.player[name](videoId)
      } else {
        setTimeout(function () {
          this.update(videoId)
        }.bind(this), 100)
      }
    }
  },
  mounted() {
    container.register((YouTube) => {
      const {
        playerHeight : height = '390',
        playerWidth : width = '640',
        playerVars = {autoplay: 0, start: 0},
        videoId
      } = this

      this.player = new YouTube.Player(this.elementId, {
        height,
        width,
        playerVars,
        videoId,
        events: {
          onReady: (event) => {
            this.$emit('ready', event.target)
          },
          onStateChange: (event) => {
            if (event.data !== -1) {
              this.$emit(container.events[event.data], event.target)
            }
          },
          onError: (event) => {
            this.$emit('error', event.target)
          }
        }
      })
    })
  },
  beforeDestroy() {
    if (this.player !== null) {
      this.player.destroy()
    }
    delete this.player
  }
}

export function install(Vue) {
  container.Vue = Vue
  YouTubePlayer.ready = YouTubePlayer.mounted
  Vue.component('youtube', YouTubePlayer)
  Vue.prototype.$youtube = {getIdFromURL, getTimeFromURL}

  const tag = document.createElement('script')
  tag.src = "https://www.youtube.com/player_api"
  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

  window.onYouTubeIframeAPIReady = function() {
    container.YT = YT
    const { PlayerState } = YT

    container.events[PlayerState.ENDED] = 'ended'
    container.events[PlayerState.PLAYING] = 'playing'
    container.events[PlayerState.PAUSED] = 'paused'
    container.events[PlayerState.BUFFERING] = 'buffering'
    container.events[PlayerState.CUED] = 'cued'

    Vue.nextTick(() => {
      container.run()
    })
  }
}

export default {
   getIdFromURL, getTimeFromURL, YouTubePlayer, install
}
