<template lang="html">
  <container :title="title">
    <h2>EmbedConfig</h2>
    <youtube video-id="M7lc1UVf-VE" :embedConfig="embedConfig"></youtube>
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
      embedConfig: {
        relatedVideos: ['xxxxx', 'xxxxx'],
        adsConfig: {
          adTagParameters: {
            iu: `xxxxxx`,
          },
          nonPersonalizedAd: true,
        },
      }
    }
  },
  components: { container }
}
</script>

<style lang="css">
</style>
