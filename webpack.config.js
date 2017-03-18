'use strict'

const webpack = require('webpack')
const version = require('./package.json').version

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
      { test: /.\js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(`Vue YouTube Embed version ${version} under MIT License copyright ${new Date().getFullYear()} kaorun343`)
  ]
}
