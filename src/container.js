'use strict'

export default {
  scripts: [],
  events: {},

  run () {
    this.scripts.forEach((callback) => {
      callback(this.YT)
    })
    this.scripts = []
  },

  register (callback) {
    if (this.YT) {
      this.Vue.nextTick(() => {
        callback(this.YT)
      })
    } else {
      this.scripts.push(callback)
    }
  }
}
