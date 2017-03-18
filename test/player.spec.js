import assert from 'power-assert'
import Vue from 'vue'
import YouTubePlayer from '../src/player'

import container from '../src/container'

describe('YouTubePlayer', () => {
  before(() => {
    class Player {
      constructor (el, options) {
        this.el = el
        this.options = options
        this.muted = false
      }
      cueVideoById () {}
      loadVideoById () {}
      destroy () {}
      mute () { this.muted = true }
      unMute () { this.muted = false }
      isMuted () { return this.muted }
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
      const vm = new Vue(YouTubePlayer)
      vm.$mount()

      assert.ok(container.register.called)
      container.register.restore()
    })

    context('default values', () => {
      it('should pass the default values', () => {
        const videoId = 'videoId'

        const vm = new Vue({
          mixins: [YouTubePlayer],
          propsData: {
            videoId
          }
        })
        vm.$mount()

        assert.equal(vm.videoId, 'videoId')
        assert.equal(vm.playerWidth, '640')
        assert.equal(vm.playerHeight, '390')
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

        const vm = new Vue({
          mixins: [YouTubePlayer],
          propsData: {
            videoId, playerHeight, playerWidth, playerVars
          }
        })
        vm.$mount()

        assert.equal(vm.videoId, videoId)
        assert.equal(vm.playerWidth, playerWidth)
        assert.equal(vm.playerHeight, playerHeight)
        assert.deepEqual(vm.playerVars, playerVars)
      })
    })
  })

  describe('#update', () => {
    context('default', () => {
      it('should call YT.Player.prototype.cueVideoById()', () => {
        const vm = new Vue({
          mixins: [YouTubePlayer],
          propsData: {
            videoId: 'videoId'
          }
        })
        vm.$mount()

        sinon.spy(vm.player, 'cueVideoById')
        vm.update('videoId')
        assert.ok(vm.player.cueVideoById.called)
      })
    })

    context('autoplay is 0', () => {
      it('should call YT.Player.prototype.cueVideoById()', () => {
        const vm = new Vue({
          mixins: [YouTubePlayer],
          propsData: {
            videoId: 'videoId'
          }
        })
        vm.$mount()

        sinon.spy(vm.player, 'cueVideoById')
        vm.update('videoId')
        assert.ok(vm.player.cueVideoById.called)
      })
    })

    context('autoplay is 1', () => {
      it('should call YT.Player.prototype.loadVideoById()', () => {
        const vm = new Vue({
          mixins: [YouTubePlayer],
          propsData: {
            videoId: 'videoId',
            playerVars: {
              autoplay: 1
            }
          }
        })
        vm.$mount()

        sinon.spy(vm.player, 'loadVideoById')
        vm.update('videoId')
        assert.ok(vm.player.loadVideoById.called)
      })
    })
  })

  describe('#setMute', () => {
    it('should update "mute"', (done) => {
      const vm = new Vue({
        mixins: [YouTubePlayer]
      })

      vm.$mount()

      vm.mute = true
      Vue.nextTick(() => {
        assert.ok(vm.player.isMuted())
        done()
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
