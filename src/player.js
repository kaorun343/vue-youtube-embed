import container from './container'

let pid = 0

export default {
  props: ['playerHeight', 'playerWidth', 'playerVars', 'videoId', 'mute'],
  render (h) {
    return h('div', [
      h('div', { attrs: { id: this.elementId }})
    ])
  },
  template: '<div><div :id="elementId"></div></div>',
  watch: {
    playerWidth: 'setSize',
    playerHeight: 'setSize',
    videoId: 'update',
    mute: 'setMute'
  },
  data () {
    pid += 1
    return {
      elementId: `youtube-player-${pid}`,
      player: {}
    }
  },
  methods: {
    setSize () {
      this.player.setSize(this.playerWidth || '640', this.playerHeight || '390')
    },
    setMute () {
      if (this.mute && this.player.isMuted()) {
        this.player.mute()
      } else {
        this.player.unMute()
      }
    },
    update (videoId) {
      const {
        playerVars = { autoplay: 0 }
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
  mounted () {
    container.register((YouTube) => {
      const {
        playerHeight: height = '390',
        playerWidth: width = '640',
        playerVars = { autoplay: 0, start: 0 },
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

      this.setMute()
    })
  },
  beforeDestroy () {
    if (this.player !== null) {
      this.player.destroy()
    }
    delete this.player
  }
}
