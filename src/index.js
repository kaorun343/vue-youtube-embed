import { getIdFromURL, getTimeFromURL } from './utils'
import container from './container'
import YouTubePlayer from './player'

export { YouTubePlayer, getIdFromURL, getTimeFromURL }

export default {
  install (Vue, options = { global: true }) {
    container.Vue = Vue
    YouTubePlayer.ready = YouTubePlayer.mounted
    if (options.global) {
      Vue.component('youtube', YouTubePlayer)
    }
    Vue.prototype.$youtube = { getIdFromURL, getTimeFromURL }

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/player_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = function () {
        container.YT = YT
        const { PlayerState } = YT

        container.events[PlayerState.ENDED] = 'ended'
        container.events[PlayerState.PLAYING] = 'playing'
        container.events[PlayerState.PAUSED] = 'paused'
        container.events[PlayerState.BUFFERING] = 'buffering'
        container.events[PlayerState.CUED] = 'cued'

        container.Vue.nextTick(() => {
          container.run()
        })
      }
    }
  }
}

