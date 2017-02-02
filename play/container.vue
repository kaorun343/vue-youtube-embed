<template lang="html">
  <section class="container">
    <h1 class="title">{{ title }}</h1>
    <slot></slot>
  </section>
</template>

<script>
import Vue from 'vue'
import YouTube from '../src/index'
Vue.use(YouTube)

export default {
  props: ['title'],
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="css" scoped>
.container {
  padding: 0 2rem;
}

.title {
  border-bottom: 2px solid red;
}

form {
  border: solid 1px #333;
  margin: .5rem 0;
  padding: .5rem;
}

.row {
  display: flex;
}

.columns {
  padding: .5rem;
  flex: 1;
}

label, input, select {
  display: block;
}

input, select {
  width: 100%;
  font-size: 16px;
  background-color: white;
}
</style>
