/*!
 * Vue YouTube Embed version 2.2.2
 * under MIT License copyright 2019 kaorun343
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

  var youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
  var timeRegexp = /t=(\d+)[ms]?(\d+)?s?/;

  /**
   * get id from url
   * @param  {string} url url
   * @return {string}     id
   */
  function getIdFromURL (url) {
    var id = url.replace(youtubeRegexp, '$1');

    if (id.includes(';')) {
      var pieces = id.split(';');

      if (pieces[1].includes('%')) {
        var uriComponent = decodeURIComponent(pieces[1]);
        id = ("http://youtube.com" + uriComponent).replace(youtubeRegexp, '$1');
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
  function getTimeFromURL (url) {
    if ( url === void 0 ) url = '';

    var times = url.match(timeRegexp);

    if (!times) {
      return 0
    }

    var full = times[0];
    var minutes = times[1];
    var seconds = times[2];

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

    run: function run () {
      var this$1 = this;

      this.scripts.forEach(function (callback) {
        callback(this$1.YT);
      });
      this.scripts = [];
    },

    register: function register (callback) {
      var this$1 = this;

      if (this.YT) {
        this.Vue.nextTick(function () {
          callback(this$1.YT);
        });
      } else {
        this.scripts.push(callback);
      }
    }
  };

  var pid = 0;

  var YouTubePlayer = {
    name: 'YoutubeEmbed',
    props: {
      playerHeight: {
        type: [String, Number],
        default: '360'
      },
      playerWidth: {
        type: [String, Number],
        default: '640'
      },
      playerVars: {
        type: Object,
        default: function () { return ({ autoplay: 0, time: 0 }); }
      },
      videoId: {
        type: String
      },
      mute: {
        type: Boolean,
        default: false
      },
      host: {
        type: String,
        default: 'https://www.youtube.com'
      }
    },
    render: function render (h) {
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
    data: function data () {
      pid += 1;
      return {
        elementId: ("youtube-player-" + pid),
        player: {}
      }
    },
    methods: {
      setSize: function setSize () {
        this.player.setSize(this.playerWidth, this.playerHeight);
      },
      setMute: function setMute (value) {
        if (value) {
          this.player.mute();
        } else {
          this.player.unMute();
        }
      },
      update: function update (videoId) {
        var name = (this.playerVars.autoplay ? 'load' : 'cue') + "VideoById";
        if (this.player.hasOwnProperty(name)) {
          this.player[name](videoId);
        } else {
          setTimeout(function () {
            this.update(videoId);
          }.bind(this), 100);
        }
      }
    },
    mounted: function mounted () {
      var this$1 = this;

      container.register(function (YouTube) {
        var ref = this$1;
        var playerHeight = ref.playerHeight;
        var playerWidth = ref.playerWidth;
        var playerVars = ref.playerVars;
        var videoId = ref.videoId;
        var host = ref.host;

        this$1.player = new YouTube.Player(this$1.elementId, {
          height: playerHeight,
          width: playerWidth,
          playerVars: playerVars,
          videoId: videoId,
          host: host,
          events: {
            onReady: function (event) {
              this$1.setMute(this$1.mute);
              this$1.$emit('ready', event);
            },
            onStateChange: function (event) {
              if (event.data !== -1) {
                this$1.$emit(container.events[event.data], event);
              }
            },
            onError: function (event) {
              this$1.$emit('error', event);
            }
          }
        });
      });
    },
    beforeDestroy: function beforeDestroy () {
      if (this.player !== null && this.player.destroy) {
        this.player.destroy();
      }
      delete this.player;
    }
  };

  var index = {
    install: function install (Vue, options) {
      if ( options === void 0 ) options = {};

      container.Vue = Vue;
      YouTubePlayer.ready = YouTubePlayer.mounted;
      var global = options.global; if ( global === void 0 ) global = true;
      var componentId = options.componentId; if ( componentId === void 0 ) componentId = 'youtube';

      if (global) {
        // if there is a global component with "youtube" identifier already taken
        // then we should let user to pass a new identifier.
        Vue.component(componentId, YouTubePlayer);
      }
      Vue.prototype.$youtube = { getIdFromURL: getIdFromURL, getTimeFromURL: getTimeFromURL };

      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/player_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function () {
          container.YT = YT;
          var PlayerState = YT.PlayerState;

          container.events[PlayerState.ENDED] = 'ended';
          container.events[PlayerState.PLAYING] = 'playing';
          container.events[PlayerState.PAUSED] = 'paused';
          container.events[PlayerState.BUFFERING] = 'buffering';
          container.events[PlayerState.CUED] = 'cued';

          container.Vue.nextTick(function () {
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
