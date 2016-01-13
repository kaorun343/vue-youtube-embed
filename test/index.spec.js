'use strict'
import assert from 'power-assert'
import Vue from 'vue'
import { getIdFromURL, getTimeFromURL, container, YouTubePlayer, install } from '../src/index'

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
        Player() {}
      }
      container.Vue = {
        nextTick(callback) {
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
      constructor(el, options) {
        this.el = el
        this.options = options
      }
      cueVideoById() {}
      loadVideoById() {}
      destroy() {}
    }
    container.YT = {
      Player
    }

    container.Vue = {
      nextTick(callback) {
        callback()
      }
    }
  })
  describe('#bind', () => {
    it('should give an unique id to its element', () => {
      const directive1 = Object.create(YouTubePlayer)
      const directive2 = Object.create(YouTubePlayer)
      directive1.el = document.createElement('div')
      directive2.el = document.createElement('div')
      directive1.bind()
      directive2.bind()
      assert(directive1.el.id !== directive2.el.id)
    })

    it('should not change the id of its element when id is defined', () => {
      const directive = Object.create(YouTubePlayer)
      const el = document.createElement('div')
      const originalId = "originalId"
      el.id = originalId
      directive.el = el
      directive.bind()
      assert.equal(directive.el.id, originalId)
    })

    it('should set the player "null"', () => {
      const directive = Object.create(YouTubePlayer)
      directive.el = document.createElement('div')
      directive.bind()
      assert(directive.player === null)
    })
  })

  describe('#update', () => {

    context('the first time', () => {
      it('should create the instance of YT.Player', () => {
        sinon.spy(container, 'register')
        const directive = Object.assign(Object.create(YouTubePlayer), {
          el: document.createElement('div'),
          params: {},
          modifiers: {}
        })
        directive.bind()
        directive.update('videoId')
        assert.ok(container.register.called)
        assert(directive.player instanceof container.YT.Player)
        container.register.restore()
      })

      context('default values', () => {
        it('should pass the default values', () => {
          const directive = Object.assign(Object.create(YouTubePlayer), {
            el: document.createElement('div'),
            params: {},
            modifiers: {}
          })
          directive.bind()
          directive.update('videoId')
          const {options} = directive.player
          assert.equal(options.videoId, 'videoId')
          assert.equal(options.width, '640')
          assert.equal(options.height, '390')
        })
      })

      context('params are passed', () => {
        it('should pass the params instead of default values', () => {
          const directive = Object.assign(Object.create(YouTubePlayer), {
            el: document.createElement('div'),
            params: {
              width: '1280',
              height: '750',
              playerVars: {
                start: 30,
                autoplay: 1
              }
            },
            modifiers: {}
          })
          directive.bind()
          directive.update('videoId')
          const {options} = directive.player
          assert.equal(options.videoId, 'videoId')
          assert.equal(options.width, '1280')
          assert.equal(options.height, '750')
          assert.deepEqual(options.playerVars, {start: 30, autoplay: 1})
        })
      })

      context('url is passed', () => {
        it('should pass the correct videoId', () => {
          const directive = Object.assign(Object.create(YouTubePlayer), {
            el: document.createElement('div'),
            params: {},
            modifiers: {
              url: true
            }
          })
          directive.bind()
          directive.update('https://youtu.be/3FY4MRdQOdE')
          assert.equal(directive.player.options.videoId, '3FY4MRdQOdE')
        })

        it('should deal with the start time in the url', () => {
          const directive = Object.assign(Object.create(YouTubePlayer), {
            el: document.createElement('div'),
            params: {},
            modifiers: {
              url: true
            }
          })
          directive.bind()
          directive.update('https://www.youtube.com/watch?v=3MteSlpxCpo&feature=youtu.be&t=4m20s')
          assert.equal(directive.player.options.playerVars.start, 4 * 60 + 20)
        })
      })
    })

    context('value is changed', () => {

      context('default', () => {
        it('should call YT.Player.prototype.cueVideoById()', () => {
          const directive = Object.assign(Object.create(YouTubePlayer), {
            params: {},
            modifiers: {},
            player: new container.YT.Player(null, null)
          })
          sinon.spy(directive.player, 'cueVideoById')
          directive.update('videoId')
          assert.ok(directive.player.cueVideoById.called)
        })
      })

      context('autoplay is 0', () => {
        it('should call YT.Player.prototype.cueVideoById()', () => {
          const directive = Object.assign(Object.create(YouTubePlayer), {
            params: {
              playerVars: {
                autoplay: 0
              }
            },
            modifiers: {},
            player: new container.YT.Player(null, null)
          })
          sinon.spy(directive.player, 'cueVideoById')
          directive.update('videoId')
          assert.ok(directive.player.cueVideoById.called)
        })
      })

      context('autoplay is 1', () => {
        it('should call YT.Player.prototype.loadVideoById()', () => {
          const directive = Object.assign(Object.create(YouTubePlayer), {
            params: {
              playerVars: {
                autoplay: 1
              }
            },
            modifiers: {},
            player: new container.YT.Player(null, null)
          })
          sinon.spy(directive.player, 'loadVideoById')
          directive.update('videoId')
          assert.ok(directive.player.loadVideoById.called)
        })
      })
    })
  })

  describe('#unbind', () => {
    it('should call YT.Player.prototype.destroy()', () => {
      const directive = Object.assign(Object.create(YouTubePlayer), {
        params: {},
        modifiers: {}
      })
      const player = new container.YT.Player(null, null)
      directive.player = player
      sinon.spy(player, 'destroy')
      directive.unbind()
      assert.ok(player.destroy.called)
      assert.ok(typeof directive.player === 'undefined')
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

  it('should add "youtube" directive to Vue', () => {
    assert.equal(Vue.directive('youtube'), YouTubePlayer)
  })

  it('should add functions to Vue.prototype', () => {
    const {$youtube} = Vue.prototype
    assert(typeof $youtube === 'object')
    assert.equal($youtube.getIdFromURL, getIdFromURL)
    assert.equal($youtube.getTimeFromURL, getTimeFromURL)
  })
})
