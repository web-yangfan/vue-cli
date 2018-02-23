"use strict";
const config = require('../config')
const utils = require('./utils')


// 是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

// vue-loader的配置
// https://github.com/vuejs/vue-loader
// TODO 分享这个模块
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    // 提取出独立的文件
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}