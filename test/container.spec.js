import assert from 'power-assert'
import container from '../src/container'

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
