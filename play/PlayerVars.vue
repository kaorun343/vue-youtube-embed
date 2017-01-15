<template lang="html">
  <container :title="title">
    <h2>Autoplay</h2>
    <youtube video-id="M7lc1UVf-VE" :player-vars="player1"></youtube>
    <h2>Start</h2>
    <youtube video-id="M7lc1UVf-VE" :player-vars="player2"></youtube>
    <h2>Show Info</h2>
    <youtube video-id="M7lc1UVf-VE" :player-vars="player3"></youtube>
    <h2>Playlist</h2>
    <youtube video-id="M7lc1UVf-VE" :player-vars="player4"></youtube>
  </container>
</template>

<script>
import container from './container.vue'

export default {
  data () {
    return {
      title: 'Player Vars',
      player1: {
        autoplay: 1
      },
      player2: {
        start: 60
      },
      player3: {
        showinfo: 0
      },
      player4: {
        playlist: 'M7lc1UVf-VE,M7lc1UVf-VE,M7lc1UVf-VE'
      }
    }
  },
  components: { container }
}
</script>

<style lang="css">
</style>
