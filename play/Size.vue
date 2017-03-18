<template lang="html">
  <container :title="title">
    <form @submit.prevent class="row">
      <div class="columns">
        <label for="height">Height</label>
        <input type="number" name="height" id="height" v-model.number="height">
      </div>
      <div class="columns">
        <label for="width">Width</label>
        <input type="number" name="width" id="width" v-model.number="width">
      </div>
    </form>
    <youtube video-id="M7lc1UVf-VE" :player-width="width" :player-height="height"></youtube>
  </container>
</template>

<script>
import container from './container.vue'

export default {
  data () {
    return {
      title: 'Height and Width',
      height: 390,
      width: 640
    }
  },
  components: { container }
}
</script>

<style lang="css">
</style>
