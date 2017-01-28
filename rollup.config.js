import buble from 'rollup-plugin-buble'

const { version } = require('./package.json')

export default {
  entry: './src/index.js',
  dest: './lib/vue-youtube-embed.js',
  format: 'umd',
  moduleName: 'VueYouTubeEmbed',
  exports: 'named',
  plugins: [
    buble()
  ],
  banner: `/*!
  * Vue YouTube Embed version ${version}
  * under MIT License copyright ${new Date().getFullYear()} kaorun343
  */`
}
