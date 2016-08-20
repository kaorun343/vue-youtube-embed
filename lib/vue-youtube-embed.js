/*! Vue YouTube Embed version 0.4.1 under MIT License copyright 2016 kaorun343 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueYouTubeEmbed"] = factory();
	else
		root["VueYouTubeEmbed"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getIdFromURL = getIdFromURL;
exports.getTimeFromURL = getTimeFromURL;
exports.install = install;
if (!String.prototype.includes) {
  String.prototype.includes = function () {
    'use strict';

    return String.prototype.indexOf.apply(this, arguments) !== -1;
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

  if (id.includes(";")) {
    var pieces = id.split(";");

    if (pieces[1].includes("%")) {
      var uriComponent = decodeURIComponent(pieces[1]);
      id = ('http://youtube.com' + uriComponent).replace(youtubeRegexp, "$1");
    } else {
      id = pieces[0];
    }
  } else if (id.includes("#")) {
    id = id.split("#")[0];
  }

  return id;
}

/**
 * get time from url
 * @param  {string} url url
 * @return {number}     time
 */
function getTimeFromURL() {
  var url = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

  var times = url.match(timeRegexp);

  if (!times) {
    return 0;
  }

  var _times = _slicedToArray(times, 3);

  var full = _times[0];
  var minutes = _times[1];
  var seconds = _times[2];


  if (typeof seconds !== "undefined") {
    seconds = parseInt(seconds, 10);
    minutes = parseInt(minutes, 10);
  } else if (full.includes("m")) {
    minutes = parseInt(minutes, 10);
    seconds = 0;
  } else {
    seconds = parseInt(minutes, 10);
    minutes = 0;
  }

  return seconds + minutes * 60;
}

var container = exports.container = {
  scripts: [],

  run: function run() {
    var _this = this;

    this.scripts.forEach(function (callback) {
      callback(_this.YT);
    });
    this.scripts = [];
  },
  register: function register(callback) {
    var _this2 = this;

    if (this.YT) {
      this.Vue.nextTick(function () {
        callback(_this2.YT);
      });
    } else {
      this.scripts.push(callback);
    }
  }
};

var events = {
  0: 'ended',
  1: 'playing',
  2: 'paused',
  3: 'buffering',
  5: 'queued'
};

var pid = 0;

var YouTubePlayer = exports.YouTubePlayer = {
  props: ['playerHeight', 'playerWidth', 'playerVars', 'videoId'],
  template: '<div><div :id="elementId"></div></div>',
  watch: {
    playerWidth: 'setSize',
    playerHeight: 'setSize',
    videoId: 'update'
  },
  data: function data() {
    pid += 1;
    return {
      elementId: 'youtube-player-' + pid
    };
  },

  methods: {
    setSize: function setSize() {
      this.player.setSize(this.playerWidth || '640', this.playerHeight || '390');
    },
    update: function update(videoId) {
      var _playerVars = this.playerVars;
      var playerVars = _playerVars === undefined ? { autoplay: 0 } : _playerVars;

      var name = (playerVars.autoplay ? 'load' : 'cue') + 'VideoById';
      this.player[name](videoId);
    }
  },
  ready: function ready() {
    var _this3 = this;

    container.register(function (YouTube) {
      var _playerHeight = _this3.playerHeight;
      var height = _playerHeight === undefined ? '390' : _playerHeight;
      var _playerWidth = _this3.playerWidth;
      var width = _playerWidth === undefined ? '640' : _playerWidth;
      var _playerVars2 = _this3.playerVars;
      var playerVars = _playerVars2 === undefined ? { autoplay: 0, start: 0 } : _playerVars2;
      var videoId = _this3.videoId;


      _this3.player = new YouTube.Player(_this3.elementId, {
        height: height,
        width: width,
        playerVars: playerVars,
        videoId: videoId,
        events: {
          onReady: function onReady(event) {
            _this3.$emit('ready', event.target);
          },
          onStateChange: function onStateChange(event) {
            if (event.data !== -1) {
              _this3.$emit(events[event.data], event.target);
            }
          },
          onError: function onError(event) {
            _this3.$emit('error', event.target);
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
  Vue.component('youtube', YouTubePlayer);
  Vue.prototype.$youtube = { getIdFromURL: getIdFromURL, getTimeFromURL: getTimeFromURL };

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function () {
    container.YT = YT;
    Vue.nextTick(function () {
      container.run();
    });
  };
}

exports.default = {
  getIdFromURL: getIdFromURL, getTimeFromURL: getTimeFromURL, YouTubePlayer: YouTubePlayer, install: install
};

/***/ }
/******/ ])
});
;