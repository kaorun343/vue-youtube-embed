'use strict'
Vue.use(VueYouTubeEmbed)
var events = VueYouTubeEmbed.events

window.app = new Vue({
  el: '#app',
  data: {
    videoId: 'M7lc1UVf-VE',
    nextId: '',
    videos: []
  },
  events: {
    [events.READY]: function(player) {
      console.log(events.READY, player)
      this.player = player
    },
    [events.PLAYING]: function(player) {
      console.log(events.PLAYING, player)
    },
    [events.ENDED]: function(player) {
      console.log(events.ENDED, player)
    }
  },
  methods: {
    pause() {
      this.player.pauseVideo()
    },
    next() {
      this.videoId = this.nextId
      this.nextId = ''
    },
    add() {
      this.videos.push(this.nextId)
      this.nextId = ''
    }
  },
  components: {
    VideoList: {
      props: ['video'],
      template: '<div><h2>video: {{video}}</h2><div v-youtube="video"></div></div>'
    }
  }
})
