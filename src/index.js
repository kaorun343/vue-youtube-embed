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

export const events = {
  READY: 'youtube:player:ready',
  ENDED: 'youtube:player:ended',
  PLAYING: 'youtube:player:playing',
  PAUSED: 'youtube:player:paused',
  BUFFERING: 'youtube:player:buffering',
  QUEUED: 'youtube:player:queued',
  ERROR: 'youtube:player:error'
}

const _events = {
  0: events.ENDED,
  1: events.PLAYING,
  2: events.PAUSED,
  3: events.BUFFERING,
  5: events.QUEUED
}

function setSize() {
  let {width = '640', height = '390'} = this.params
  this.player.setSize(width, height)
}

let pid = 0

export const YouTubePlayer = {
  params: ['width', 'height', 'player-vars'],
  paramWatchers: {
    width: setSize,
    height: setSize
  },
  bind() {
    this.el.id = this.el.id || `v-youtube-player-${pid}`
    pid += 1
    this.player = null
  },
  update(videoId) {
    let start = 0
    if (this.modifiers.url) {
      start = getTimeFromURL(videoId)
      videoId = getIdFromURL(videoId)
    }

    if (this.player === null) {
      container.register((YouTube) => {
        let {width = '640', height = '390', playerVars = {}} = this.params
        playerVars.start = playerVars.start || start
        const vm = this.vm
        this.player = new YouTube.Player(this.el.id, {
          width,
          height,
          videoId,
          playerVars,
          events: {
            onReady(event) {
              vm.$emit(events.READY, event.target)
            },
            onStateChange(event) {
              if (event.data !== -1) {
                vm.$emit(_events[event.data], event.target)
              }
            },
            onError(event) {
              vm.$emit(events.ERROR, event.target)
            }
          }
        })
      })
    } else {
      const {playerVars = {autoplay: 0}} = this.params
      const name = `${playerVars.autoplay ? 'load' : 'cue'}VideoById`
      this.player[name](videoId)
    }
  },
  unbind() {
    this.player.destroy()
    delete this.player
  }
}

export function install(Vue) {
  container.Vue = Vue
  Vue.directive('youtube', YouTubePlayer)
  Vue.prototype.$youtube = {getIdFromURL, getTimeFromURL}

  const tag = document.createElement('script')
  tag.src = "https://www.youtube.com/player_api"
  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

  window.onYouTubeIframeAPIReady = function() {
    container.YT = YT
    container.run()
  }
}

export default {
   getIdFromURL, getTimeFromURL, YouTubePlayer, install
}
