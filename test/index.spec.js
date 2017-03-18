import Vue from 'vue'
import assert from 'power-assert'
import VueYouTubeEmbed from '../src/index'
import { getIdFromURL, getTimeFromURL } from '../src/utils'

describe('install', () => {
  before(() => {
    Vue.use(VueYouTubeEmbed)
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
