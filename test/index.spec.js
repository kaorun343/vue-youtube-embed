'use strict'
import Vue from 'vue'
import assert from 'power-assert'
import { YouTubePlayer, install } from '../src/index'
import container from '../src/container'
import { getIdFromURL, getTimeFromURL } from '../src/utils'

// fork from https://github.com/brandly/angular-youtube-embed
describe('getIdFromURL', () => {
  it('should handle regular query strings', () => {
    const url = 'https://www.youtube.com/watch?v=nViWpVc1x_4&feature=youtu.be'
    const id = 'nViWpVc1x_4'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle attribution_link', () => {
    const url = 'http://www.youtube.com/attribution_link?a=pxa6goHqzaA&amp;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare'
    const id = 'dPdgx30w9sU'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle almost a query string', () => {
    const url = 'http://www.youtube.com/watch?feature=player_detailpage&amp;v=93LvTKF_jW0#t=1'
    const id = '93LvTKF_jW0'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle "&amp;feature=youtu.be"', () => {
    const url = 'https://www.youtube.com/watch?v=VbNF9X1waSc&amp;feature=youtu.be'
    const id = 'VbNF9X1waSc'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle http://youtu.be', () => {
    const url = 'https://youtu.be/3FY4MRdQOdE'
    const id = '3FY4MRdQOdE'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle "edit" links from video manager page', () => {
    const url = 'https://www.youtube.com/edit?o=U&video_id=3k2ZBu3kuiE'
    const id = '3k2ZBu3kuiE'
    assert.equal(getIdFromURL(url), id)
  })
})

// fork from https://github.com/brandly/angular-youtube-embed
describe('getTimeFromURL', () => {
  it('should return 0 when time is not defined', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo'
    assert.equal(getTimeFromURL(url), 0)
  })

  it('should handle the url that contains "m" and "s"', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo&feature=youtu.be&t=4m20s'
    assert.equal(getTimeFromURL(url), 20 + 4 * 60)
  })

  it('should handle the url that does not contain "s"', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo&feature=youtu.be&t=4m'
    assert.equal(getTimeFromURL(url), 4 * 60)
  })

  it('should handle the url that does not contain "m"', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo&feature=youtu.be&t=4s'
    assert.equal(getTimeFromURL(url), 4)
  })

  it('should handle the url that does not contain both "s" and "s"', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo&feature=youtu.be&t=4'
    assert.equal(getTimeFromURL(url), 4)
  })
})

describe('container', () => {
  context('when YouTube is not ready', () => {
    describe('#register', () => {
      it('should add a callback to scripts', () => {
        const length = container.scripts.length
        container.register(() => {})
        assert.equal(container.scripts.length, length + 1)
      })
    })

    after(() => {
      container.scripts = []
    })
  })

  context('when YouTube is ready', () => {
    before(() => {
      container.YT = {
        Player () {}
      }
      container.Vue = {
        nextTick (callback) {
          callback()
        }
      }
    })

    describe('#run', () => {
      it('should call calbacks and pass YT.Player to its scripts', () => {
        const spy = sinon.spy()
        container.scripts = [spy]
        container.run()
        assert.ok(spy.calledWith(container.YT))
      })

      it('should remove elements from scripts', () => {
        container.scripts.push(() => {})
        container.run()
        assert.equal(container.scripts.length, 0)
      })

      afterEach(() => {
        container.scripts = []
      })
    })

    describe('#register', () => {
      it('should call callback', () => {
        sinon.spy(container.Vue, 'nextTick')
        const callbackSpy = sinon.spy()
        container.register(callbackSpy)
        assert.ok(container.Vue.nextTick.called)
        assert.ok(callbackSpy.called)
        container.Vue.nextTick.restore()
      })
    })
  })

  after(() => {
    delete container.YT
    delete container.Vue
  })
})

describe('YouTubePlayer', () => {
  before(() => {
    class Player {
      constructor (el, options) {
        this.el = el
        this.options = options
      }
      cueVideoById () {}
      loadVideoById () {}
      destroy () {}
    }
    container.YT = {
      Player
    }
    container.Vue = {
      nextTick (callback) {
        callback()
      }
    }
  })

  describe('#ready', () => {
    it('should call container.register', () => {
      sinon.spy(container, 'register')
      YouTubePlayer.mounted()

      assert.ok(container.register.called)
      container.register.restore()
    })

    context('default values', () => {
      it('should pass the default values', () => {
        const videoId = 'videoId'
        const component = {
          mounted: YouTubePlayer.mounted,
          videoId
        }
        component.mounted()

        const { options } = component.player
        assert.equal(options.videoId, 'videoId')
        assert.equal(options.width, '640')
        assert.equal(options.height, '390')
      })
    })

    context('params are passed', () => {
      it('should pass the params instead of default values', () => {
        const videoId = 'videoId'
        const playerWidth = '1280'
        const playerHeight = '750'
        const playerVars = {
          start: 30,
          autoplay: 1
        }
        const component = {
          mounted: YouTubePlayer.mounted,
          videoId,
          playerWidth,
          playerHeight,
          playerVars
        }
        component.mounted()

        const { options } = component.player
        assert.equal(options.videoId, videoId)
        assert.equal(options.width, playerWidth)
        assert.equal(options.height, playerHeight)
        assert.deepEqual(options.playerVars, playerVars)
      })
    })
  })

  describe('#update', () => {
    context('default', () => {
      it('should call YT.Player.prototype.cueVideoById()', () => {
        const component = {
          mounted: YouTubePlayer.mounted,
          update: YouTubePlayer.methods.update
        }
        component.mounted()
        sinon.spy(component.player, 'cueVideoById')
        component.update('videoId')
        assert.ok(component.player.cueVideoById.called)
      })
    })

    context('autoplay is 0', () => {
      it('should call YT.Player.prototype.cueVideoById()', () => {
        const component = {
          mounted: YouTubePlayer.mounted,
          update: YouTubePlayer.methods.update,
          playerVars: {
            autoplay: 0
          }
        }
        component.mounted()
        sinon.spy(component.player, 'cueVideoById')
        component.update('videoId')
        assert.ok(component.player.cueVideoById.called)
      })
    })

    context('autoplay is 1', () => {
      it('should call YT.Player.prototype.loadVideoById()', () => {
        const component = {
          mounted: YouTubePlayer.mounted,
          update: YouTubePlayer.methods.update,
          playerVars: {
            autoplay: 1
          }
        }
        component.mounted()
        sinon.spy(component.player, 'loadVideoById')
        component.update('videoId')
        assert.ok(component.player.loadVideoById.called)
      })
    })
  })

  describe('#beforeDestroy', () => {
    it('should call YT.Player.prototype.destroy()', () => {
      const component = {
        beforeDestroy: YouTubePlayer.beforeDestroy
      }
      const player = new container.YT.Player(null, null)
      component.player = player
      sinon.spy(player, 'destroy')
      component.beforeDestroy()
      assert.ok(player.destroy.called)
      assert.ok(typeof component.player === 'undefined')
    })
  })

  after(() => {
    delete container.YT
  })
})

describe('install', () => {
  before(() => {
    Vue.use(install)
  })

  it('should add "youtube" component to Vue', () => {
    assert.ok(typeof Vue.component('youtube') !== 'undefined')
  })

  it('should add functions to Vue.prototype', () => {
    const { $youtube } = Vue.prototype
    assert(typeof $youtube === 'object')
    assert.equal($youtube.getIdFromURL, getIdFromURL)
    assert.equal($youtube.getTimeFromURL, getTimeFromURL)
  })
})
