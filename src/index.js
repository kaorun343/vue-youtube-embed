'use strict'

if (!String.prototype.includes) {
  String.prototype.includes = function() {
    'use strict'
    return String.prototype.indexOf.apply(this, arguments) !== -1
  }
}

const youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig
const timeRegexp = /t=(\d+)[ms]?(\d+)?s?/

/**
 * get id from url
 * @param  {string} url url
 * @return {string}     id
 */
export function getIdFromURL(url) {
  let id = url.replace(youtubeRegexp, "$1")

  if ( id.includes(";") ) {
    const pieces = id.split(";")

    if ( pieces[1].includes("%") ) {
      const uriComponent = decodeURIComponent(pieces[1])
      id = `http://youtube.com${uriComponent}`.replace(youtubeRegexp, "$1")
    } else {
      id = pieces[0]
    }
  } else if ( id.includes("#") ) {
    id = id.split("#")[0]
  }

  return id
}

/**
 * get time from url
 * @param  {string} url url
 * @return {number}     time
 */
export function getTimeFromURL(url = "") {
  const times = url.match(timeRegexp)

  if ( !times ) {
    return 0
  }

  let [full, minutes, seconds] = times

  if ( typeof seconds !== "undefined" ) {
    seconds = parseInt(seconds, 10)
    minutes = parseInt(minutes, 10)
  } else if ( full.includes("m") ) {
    minutes = parseInt(minutes, 10)
    seconds = 0
  } else {
    seconds = parseInt(minutes, 10)
    minutes = 0
  }

  return seconds + (minutes * 60)
}

export const container = {
  scripts: [],

  run() {
    this.scripts.forEach((callback) => {
      callback(this.YT)
    })
    this.scripts = []
  },

  register(callback) {
    if (this.YT) {
      this.Vue.nextTick(() => {
        callback(this.YT)
      })
    } else {
      this.scripts.push(callback)
    }
  }
}

const events = {
  0: 'ended',
  1: 'playing',
  2: 'paused',
  3: 'buffering',
  5: 'queued'
}

let pid = 0

export const YouTubePlayer = {
  props: ['playerHeight', 'playerWidth', 'playerVars', 'videoId'],
  template: '<div><div :id="elementId"></div></div>',
  watch: {
    playerWidth: 'setSize',
    playerHeight: 'setSize',
    videoId: 'update'
  },
  data() {
    pid += 1
    return {
      elementId: `youtube-player-${pid}`
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
      this.player[name](videoId)
    }
  },
  ready() {
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
              this.$emit(events[event.data], event.target)
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
  Vue.component('youtube', YouTubePlayer)
  Vue.prototype.$youtube = {getIdFromURL, getTimeFromURL}

  const tag = document.createElement('script')
  tag.src = "https://www.youtube.com/player_api"
  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

  window.onYouTubeIframeAPIReady = function() {
    container.YT = YT
    Vue.nextTick(() => {
      container.run()
    })
  }
}

export default {
   getIdFromURL, getTimeFromURL, YouTubePlayer, install
}
