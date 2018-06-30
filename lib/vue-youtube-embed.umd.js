/*!
 * Vue YouTube Embed version 2.2.0
 * under MIT License copyright 2018 kaorun343
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.VueYouTubeEmbed = {})));
}(this, (function (exports) { 'use strict';

  // fork from https://github.com/brandly/angular-youtube-embed

  if (!String.prototype.includes) {
    String.prototype.includes = function () {
      return String.prototype.indexOf.apply(this, arguments) !== -1
    };
  }

  const youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
  const timeRegexp = /t=(\d+)[ms]?(\d+)?s?/;

  /**
   * get id from url
   * @param  {string} url url
   * @return {string}     id
   */
  function getIdFromURL (url) {
    let id = url.replace(youtubeRegexp, '$1');

    if (id.includes(';')) {
      const pieces = id.split(';');

      if (pieces[1].includes('%')) {
        const uriComponent = decodeURIComponent(pieces[1]);
        id = `http://youtube.com${uriComponent}`.replace(youtubeRegexp, '$1');
      } else {
        id = pieces[0];
      }
    } else if (id.includes('#')) {
      id = id.split('#')[0];
    }

    return id
  }

  /**
   * get time from url
   * @param  {string} url url
   * @return {number}     time
   */
  function getTimeFromURL (url = '') {
    const times = url.match(timeRegexp);

    if (!times) {
      return 0
    }

    const [full] = times;
    let [, minutes, seconds] = times;

    if (typeof seconds !== 'undefined') {
      seconds = parseInt(seconds, 10);
      minutes = parseInt(minutes, 10);
    } else if (full.includes('m')) {
      minutes = parseInt(minutes, 10);
      seconds = 0;
    } else {
      seconds = parseInt(minutes, 10);
      minutes = 0;
    }

    return seconds + (minutes * 60)
  }

  var container = {
    scripts: [],
    events: {},

    run () {
      this.scripts.forEach((callback) => {
        callback(this.YT);
      });
      this.scripts = [];
    },

    register (callback) {
      if (this.YT) {
        this.Vue.nextTick(() => {
          callback(this.YT);
        });
      } else {
        this.scripts.push(callback);
      }
    }
  };

  let pid = 0;

  var YouTubePlayer = {
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
      pid += 1;
      return {
        elementId: `youtube-player-${pid}`,
        player: {}
      }
    },
    methods: {
      setSize () {
        this.player.setSize(this.playerWidth, this.playerHeight);
      },
      setMute (value) {
        if (value) {
          this.player.mute();
        } else {
          this.player.unMute();
        }
      },
      update (videoId) {
        const name = `${this.playerVars.autoplay ? 'load' : 'cue'}VideoById`;
        if (this.player.hasOwnProperty(name)) {
          this.player[name](videoId);
        } else {
          setTimeout(function () {
            this.update(videoId);
          }.bind(this), 100);
        }
      }
    },
    mounted () {
      container.register((YouTube) => {
        const { playerHeight, playerWidth, playerVars, videoId } = this;

        this.player = new YouTube.Player(this.elementId, {
          height: playerHeight,
          width: playerWidth,
          playerVars,
          videoId,
          events: {
            onReady: (event) => {
              this.setMute(this.mute);
              this.$emit('ready', event);
            },
            onStateChange: (event) => {
              if (event.data !== -1) {
                this.$emit(container.events[event.data], event);
              }
            },
            onError: (event) => {
              this.$emit('error', event);
            }
          }
        });
      });
    },
    beforeDestroy () {
      if (this.player !== null && this.player.destroy) {
        this.player.destroy();
      }
      delete this.player;
    }
  };

  var index = {
    install (Vue, options = {}) {
      container.Vue = Vue;
      YouTubePlayer.ready = YouTubePlayer.mounted;
      const { global = true, componentId = 'youtube' } = options;

      if (global) {
        // if there is a global component with "youtube" identifier already taken
        // then we should let user to pass a new identifier.
        Vue.component(componentId, YouTubePlayer);
      }
      Vue.prototype.$youtube = { getIdFromURL, getTimeFromURL };

      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/player_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function () {
          container.YT = YT;
          const { PlayerState } = YT;

          container.events[PlayerState.ENDED] = 'ended';
          container.events[PlayerState.PLAYING] = 'playing';
          container.events[PlayerState.PAUSED] = 'paused';
          container.events[PlayerState.BUFFERING] = 'buffering';
          container.events[PlayerState.CUED] = 'cued';

          container.Vue.nextTick(() => {
            container.run();
          });
        };
      }
    }
  };

  exports.YouTubePlayer = YouTubePlayer;
  exports.getIdFromURL = getIdFromURL;
  exports.getTimeFromURL = getTimeFromURL;
  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
