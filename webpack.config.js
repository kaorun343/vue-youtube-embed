'use strict'

module.exports = {
  entry: './src/index.js',
  output: {
    path: './lib',
    filename: 'vue-youtube-embed.js',
    library: 'VueYouTubeEmbed',
    libraryTarget: 'umd',
    sourcePrefix: ''
  },
  module: {
    loaders: [
      {test: /.\js$/, loader: 'babel?presets[]=es2015', exclude: /node_modules/}
    ]
  }
}
