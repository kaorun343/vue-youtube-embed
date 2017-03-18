<template lang="html">
  <container :title="title">
    <youtube :video-id="videoId" :mute="mute"></youtube>
    <div>
      <button @click="mute = !mute">toggle mute</button>
    </div>
    <div>{{ mute }}</div>
  </container>
</template>

<script>
import container from './container.vue'

export default {
  components: { container },
  data () {
    return {
      title: 'Volume',
      videoId: 'M7lc1UVf-VE',
      mute: true
    }
  }
}
</script>

<style lang="css">
</style>
