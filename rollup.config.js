import buble from 'rollup-plugin-buble'

const { version } = require('./package.json')

const banner = `/*!
 * Vue YouTube Embed version ${version}
 * under MIT License copyright ${new Date().getFullYear()} kaorun343
 */`

export default {
  input: './src/index.js',
  output: [
    {
      file: './lib/vue-youtube-embed.js',
      banner,
      format: 'esm'
    }, {
      file: './lib/vue-youtube-embed.umd.js',
      name: 'VueYouTubeEmbed',
      banner,
      format: 'umd',
      exports: 'named',
      plugins: [
        buble()
      ]
    }
  ]
}
