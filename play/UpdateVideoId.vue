<template lang="html">
  <container :title="title">
    <form @submit.prevent="update">
      <div class="row">
        <div class="columns">
          <label for="video-id">New Video ID or URL</label>
          <input type="text" v-model="input" name="video-id" id="video-id">
        </div>
        <div class="columns">
          <label for="autoplay">Method</label>
          <select name="autoplay" id="autoplay" v-model.number="autoplay">
            <option value="0">cueVideoById (autoplay: 0)</option>
            <option value="1">loadVideoById (autoplay: 1)</option>
          </select>
        </div>
      </div>
    </form>
    <youtube :video-id="id | url" :player-vars="{ autoplay }"></youtube>
  </container>
</template>

<script>
import container from './container.vue'
import { getIdFromURL } from '../'

export default {
  data () {
    return {
      title: 'Update Video ID',
      id: 'M7lc1UVf-VE',
      input: '',
      autoplay: 0
    }
  },
  filters: {
    url: getIdFromURL
  },
  methods: {
    update () {
      this.id = this.input
      this.input = ''
    }
  },
  components: { container }
}
</script>

<style lang="css">
</style>
