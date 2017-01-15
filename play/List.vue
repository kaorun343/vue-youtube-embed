<template lang="html">
  <container :title="title">
    <form @submit.prevent="add">
      <div class="row">
        <div class="columns">
          <label for="id">New Video ID</label>
          <input type="text" id="id" v-model="id">
        </div>
      </div>
      <button type="submit">Add Video</button>
      <button type="button" @click="remove">Remove Video</button>
    </form>
    <youtube v-for="video in videos" :video-id="video.id"></youtube>
  </container>
</template>

<script>
import container from './container.vue'

export default {
  data () {
    return {
      title: 'List',
      videos: [{ id: 'M7lc1UVf-VE' }],
      id: ''
    }
  },
  methods: {
    add () {
      this.videos.unshift({ id: this.id })
      this.$log(`added: ${this.id}`)
      this.id = ''
    },
    remove () {
      const { id } = this.videos.shift()
      this.$log(`removed: ${id}`)
    }
  },
  components: { container }
}
</script>

<style lang="css">
</style>
