/*!
  * Vue YouTube Embed version 2.0.2
  * under MIT License copyright 2017 kaorun343
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VueYouTubeEmbed = global.VueYouTubeEmbed || {})));
}(this, (function (exports) { 'use strict';

// fork from https://github.com/brandly/angular-youtube-embed
if (!String.prototype.includes) {
  String.prototype.includes = function() {
    'use strict';
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
function getIdFromURL(url) {
  var id = url.replace(youtubeRegexp, "$1");

  if ( id.includes(";") ) {
    var pieces = id.split(";");

    if ( pieces[1].includes("%") ) {
      var uriComponent = decodeURIComponent(pieces[1]);
      id = ("http://youtube.com" + uriComponent).replace(youtubeRegexp, "$1");
    } else {
      id = pieces[0];
    }
  } else if ( id.includes("#") ) {
    id = id.split("#")[0];
  }

  return id
}

/**
 * get time from url
 * @param  {string} url url
 * @return {number}     time
 */
function getTimeFromURL(url) {
  if ( url === void 0 ) url = "";

  var times = url.match(timeRegexp);

  if ( !times ) {
    return 0
  }

  var full = times[0];
  var minutes = times[1];
  var seconds = times[2];

  if ( typeof seconds !== "undefined" ) {
    seconds = parseInt(seconds, 10);
    minutes = parseInt(minutes, 10);
  } else if ( full.includes("m") ) {
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

  run: function run() {
    var this$1 = this;

    this.scripts.forEach(function (callback) {
      callback(this$1.YT);
    });
    this.scripts = [];
  },

  register: function register(callback) {
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
  props: ['playerHeight', 'playerWidth', 'playerVars', 'videoId'],
  render: function render (h) {
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
  data: function data() {
    pid += 1;
    return {
      elementId: ("youtube-player-" + pid),
      player: {}
    }
  },
  methods: {
    setSize: function setSize() {
      this.player.setSize(this.playerWidth || '640', this.playerHeight || '390');
    },
    update: function update(videoId) {
      var ref = this;
      var playerVars = ref.playerVars; if ( playerVars === void 0 ) playerVars = {autoplay: 0};
      var name = (playerVars.autoplay ? 'load' : 'cue') + "VideoById";
      if (this.player.hasOwnProperty(name)) {
        this.player[name](videoId);
      } else {
        setTimeout(function () {
          this.update(videoId);
        }.bind(this), 100);
      }
    }
  },
  mounted: function mounted() {
    var this$1 = this;

    container.register(function (YouTube) {
      var ref = this$1;
      var height = ref.playerHeight; if ( height === void 0 ) height = '390';
      var width = ref.playerWidth; if ( width === void 0 ) width = '640';
      var playerVars = ref.playerVars; if ( playerVars === void 0 ) playerVars = {autoplay: 0, start: 0};
      var videoId = ref.videoId;

      this$1.player = new YouTube.Player(this$1.elementId, {
        height: height,
        width: width,
        playerVars: playerVars,
        videoId: videoId,
        events: {
          onReady: function (event) {
            this$1.$emit('ready', event.target);
          },
          onStateChange: function (event) {
            if (event.data !== -1) {
              this$1.$emit(container.events[event.data], event.target);
            }
          },
          onError: function (event) {
            this$1.$emit('error', event.target);
          }
        }
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.player !== null) {
      this.player.destroy();
    }
    delete this.player;
  }
};

function install(Vue) {
  container.Vue = Vue;
  YouTubePlayer.ready = YouTubePlayer.mounted;
  Vue.component('youtube', YouTubePlayer);
  Vue.prototype.$youtube = {getIdFromURL: getIdFromURL, getTimeFromURL: getTimeFromURL};

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function() {
    container.YT = YT;
    var PlayerState = YT.PlayerState;

    container.events[PlayerState.ENDED] = 'ended';
    container.events[PlayerState.PLAYING] = 'playing';
    container.events[PlayerState.PAUSED] = 'paused';
    container.events[PlayerState.BUFFERING] = 'buffering';
    container.events[PlayerState.CUED] = 'cued';

    Vue.nextTick(function () {
      container.run();
    });
  };
}

var index = {
   getIdFromURL: getIdFromURL, getTimeFromURL: getTimeFromURL, YouTubePlayer: YouTubePlayer, install: install
};

exports.YouTubePlayer = YouTubePlayer;
exports.install = install;
exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
