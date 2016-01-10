'use strict'

Vue.directive('youtube', VueYouTubeEmbeded)
var events = VueYouTubeEmbeded.events
Vue.use(VueYouTubeEmbeded)

window.app = new Vue({
  el: '#app',
  data: {
    videoId: 'M7lc1UVf-VE',
    nextId: '',
    videos: []
  },
  events: {
    [events.READY]: function(event, player) {
      console.log(events.READY, event, player)
      this.player = player
    },
    [events.PLAYING]: function(event, player) {
      console.log(events.PLAYING, event, player)
    },
    [events.ENDED]: function(event, player) {
      console.log(events.ENDED, event, player)
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
      this.videos.push({id: this.nextId})
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
