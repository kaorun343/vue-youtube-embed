import container from './container'

let pid = 0

export default {
  props: {
    playerHeight: {
      type: [String, Number],
      default: '390'
    },
    playerWidth: {
      type: [String, Number],
      default: '640'
    },
    playerVars: {
      type: Object,
      default: () => ({ autoplay: 0, time: 0 })
    },
    videoId: {
      type: String
    },
    mute: {
      type: Boolean,
      default: false
    }
  },
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
      this.player.setSize(this.playerWidth, this.playerHeight)
    },
    setMute (value) {
      if (value) {
        this.player.mute()
      } else {
        this.player.unMute()
      }
    },
    update (videoId) {
      const name = `${this.playerVars.autoplay ? 'load' : 'cue'}VideoById`
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
      const { playerHeight, playerWidth, playerVars, videoId } = this

      this.player = new YouTube.Player(this.elementId, {
        height: playerHeight,
        width: playerWidth,
        playerVars,
        videoId,
        events: {
          onReady: (event) => {
            this.setMute(this.mute)
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
  beforeDestroy () {
    if (this.player !== null) {
      this.player.destroy()
    }
    delete this.player
  }
}
