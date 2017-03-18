<template lang="html">
  <container :title="title">
    <youtube video-id="M7lc1UVf-VE"
      @ready="ready"
      @ended="ended"
      @playing="playing"
      @paused="paused"
      @buffering="buffering"
      @qued="qued"
    ></youtube>
  </container>
</template>

<script>
import container from './container.vue'

export default {
  data () {
    return {
      title: 'Events'
    }
  },
  methods: {
    log (message) {
      this.$log(`${new Date().toLocaleTimeString()} -- ${message}`)
    },
    ready () { this.log('ready') },
    ended () { this.log('ended') },
    playing () { this.log('playing') },
    paused () { this.log('paused') },
    buffering () { this.log('buffering') },
    qued () { this.log('qued') }
  },
  components: { container }
}
</script>

<style lang="css">
</style>
